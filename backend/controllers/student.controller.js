import Student from '../models/student.model.js';
import User from '../models/user.model.js';

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'email role');
    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.id }).populate('userId', 'email role');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Get student by user ID
export const getStudentByUserId = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId }).populate('userId', '-password');
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("Error getting student by user ID:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create student profile
export const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      nationality,
      email,
      phone,
      address,
      college,
      graduationYear,
      result10th,
      result12th,
      parentName,
      parentEmail,
      parentPhone,
      emergencyContactName,
      emergencyContactPhone,
      disability,
      userId
    } = req.body;

    console.log('Received student data:', req.body); // Debug log

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ userId });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student profile already exists'
      });
    }

    // Create new student profile
    const student = new Student({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      nationality,
      email,
      phone,
      address,
      college,
      graduationYear,
      result10th,
      result12th,
      parentName,
      parentEmail,
      parentPhone,
      emergencyContactName,
      emergencyContactPhone,
      disability,
      userId: userId.toString(), // Ensure userId is a string
      status: 'approved'
    });

    // Save the student profile
    const savedStudent = await student.save();
    console.log('Saved student profile:', savedStudent); // Debug log

    res.status(201).json({
      success: true,
      data: savedStudent
    });
  } catch (error) {
    console.error('Error creating student profile:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Error creating student profile',
      error: error.message
    });
  }
};

// Update student profile
export const updateStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      nationality,
      email,
      phone,
      address,
      college,
      graduationYear,
      result10th,
      result12th,
      parentName,
      parentEmail,
      parentPhone,
      emergencyContactName,
      emergencyContactPhone,
      disability,
      userId
    } = req.body;

    console.log('Received update data:', req.body); // Debug log
    console.log('User ID from params:', req.params.id); // Debug log

    // Validate user ID
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // First try to find the student
    let student = await Student.findOne({ userId: req.params.id });
    console.log('Found student:', student); // Debug log

    if (!student) {
      // If student doesn't exist, create a new one
      console.log('Student not found, creating new profile...'); // Debug log
      
      // Validate required fields for new student
      if (!firstName || !email) {
        return res.status(400).json({
          success: false,
          message: 'First name and email are required for new student profile'
        });
      }

      student = new Student({
        firstName,
        lastName,
        gender,
        dateOfBirth,
        nationality,
        email,
        phone,
        address,
        college,
        graduationYear,
        result10th,
        result12th,
        parentName,
        parentEmail,
        parentPhone,
        emergencyContactName,
        emergencyContactPhone,
        disability,
        userId: req.params.id,
        status: 'approved'
      });
    } else {
      // If student exists, update only provided fields
      const updateFields = {};
      
      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;
      if (gender) updateFields.gender = gender;
      if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
      if (nationality) updateFields.nationality = nationality;
      if (email) updateFields.email = email;
      if (phone) updateFields.phone = phone;
      if (address) updateFields.address = address;
      if (college) updateFields.college = college;
      if (graduationYear) updateFields.graduationYear = graduationYear;
      if (result10th) updateFields.result10th = result10th;
      if (result12th) updateFields.result12th = result12th;
      if (parentName) updateFields.parentName = parentName;
      if (parentEmail) updateFields.parentEmail = parentEmail;
      if (parentPhone) updateFields.parentPhone = parentPhone;
      if (emergencyContactName) updateFields.emergencyContactName = emergencyContactName;
      if (emergencyContactPhone) updateFields.emergencyContactPhone = emergencyContactPhone;
      if (disability) updateFields.disability = disability;
      
      updateFields.updatedAt = Date.now();

      // Update the student document
      student = await Student.findOneAndUpdate(
        { userId: req.params.id },
        { $set: updateFields },
        { new: true, runValidators: true }
      );
    }

    // Save the student profile
    const savedStudent = await student.save();
    console.log('Saved student profile:', savedStudent); // Debug log

    res.status(200).json({
      success: true,
      data: savedStudent
    });
  } catch (error) {
    console.error('Error updating student profile:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Error updating student profile',
      error: error.message
    });
  }
};

// Delete student profile
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ userId: req.params.id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Also delete the associated user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student profile',
      error: error.message
    });
  }
};

// Approve student profile
export const approveStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.params.id },
      { status: 'approved', updatedAt: Date.now() },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving student profile',
      error: error.message
    });
  }
};

// Reject student profile
export const rejectStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.params.id },
      { status: 'rejected', updatedAt: Date.now() },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting student profile',
      error: error.message
    });
  }
}; 