const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
    }
  }
});

// Get current user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    console.log('=== PROFILE UPDATE START ===');
    const {
      name,
      bio,
      phone,
      address,
      studentInfo,
      adminInfo,
      socialLinks
    } = req.body;

    console.log('Profile update request:', { 
      userId: req.user._id, 
      name, 
      phone, 
      role: req.user.role,
      hasStudentInfo: !!studentInfo,
      hasAddress: !!address
    });

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current user data:', {
      name: user.name,
      role: user.role,
      hasAddress: !!user.address,
      hasStudentInfo: !!user.studentInfo
    });

    // Update basic fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;

    // Initialize address if it doesn't exist
    if (!user.address) {
      user.address = {};
    }

    // Update address
    if (address) {
      user.address = {
        street: address.street || user.address.street || '',
        city: address.city || user.address.city || '',
        state: address.state || user.address.state || '',
        zipCode: address.zipCode || user.address.zipCode || '',
        country: address.country || user.address.country || ''
      };
      console.log('Updated address:', user.address);
    }

    // Initialize role-specific info if it doesn't exist
    if (user.role === 'student' && !user.studentInfo) {
      user.studentInfo = {};
    }
    if (user.role === 'admin' && !user.adminInfo) {
      user.adminInfo = {};
    }

    // Update role-specific information
    if (user.role === 'student' && studentInfo) {
      user.studentInfo = {
        course: studentInfo.course || user.studentInfo.course || '',
        year: studentInfo.year || user.studentInfo.year || '',
        rollNumber: studentInfo.rollNumber || user.studentInfo.rollNumber || '',
        department: studentInfo.department || user.studentInfo.department || '',
        university: studentInfo.university || user.studentInfo.university || ''
      };
      console.log('Updated student info:', user.studentInfo);
    }

    if (user.role === 'admin' && adminInfo) {
      user.adminInfo = {
        department: adminInfo.department || user.adminInfo.department || '',
        position: adminInfo.position || user.adminInfo.position || '',
        employeeId: adminInfo.employeeId || user.adminInfo.employeeId || '',
        specialization: adminInfo.specialization || user.adminInfo.specialization || ''
      };
      console.log('Updated admin info:', user.adminInfo);
    }

    // Initialize social links if it doesn't exist
    if (!user.socialLinks) {
      user.socialLinks = {};
    }

    // Update social links
    if (socialLinks) {
      user.socialLinks = {
        linkedin: socialLinks.linkedin || user.socialLinks.linkedin || '',
        github: socialLinks.github || user.socialLinks.github || '',
        website: socialLinks.website || user.socialLinks.website || ''
      };
      console.log('Updated social links:', user.socialLinks);
    }

    console.log('Saving user profile...');
    await user.save();
    console.log('Profile saved successfully');
    
    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    console.log('Profile updated successfully');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload profile image
router.post('/upload-image', auth, upload.single('profileImage'), async (req, res) => {
  try {
    console.log('=== PROFILE IMAGE UPLOAD START ===');
    console.log('File received:', req.file ? req.file.filename : 'No file');
    console.log('User ID:', req.user._id);

    if (!req.file) {
      console.log('No image file provided');
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current user image:', user.profileImage);

    // Delete old image if exists
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage);
      console.log('Checking old image path:', oldImagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted');
      }
    }

    // Save new image path (match multer destination)
    user.profileImage = `uploads/profiles/${req.file.filename}`;
    await user.save();

    console.log('New image saved:', user.profileImage);
    console.log('=== PROFILE IMAGE UPLOAD SUCCESS ===');

    res.json({
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('=== PROFILE IMAGE UPLOAD ERROR ===');
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete profile image
router.delete('/delete-image', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Profile image deleted from filesystem');
      }

      user.profileImage = '';
      await user.save();
      
      console.log('Profile image removed from user');
      res.json({ message: 'Profile image deleted successfully' });
    } else {
      res.status(400).json({ message: 'No profile image to delete' });
    }
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
