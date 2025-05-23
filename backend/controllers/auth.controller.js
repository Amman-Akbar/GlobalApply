import User from "../models/user.model.js";
import Institute from "../models/institute.model.js";
import Student from "../models/student.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function to generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Extended to 24 hours
  );
};

export const signup = async (req, res) => {
    const { username, email, password, image, role } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        image,
        role: role || 'student', // Default to student role if not specified
      });
  
      await newUser.save();
      console.log('User created successfully:', newUser._id);

      // If the user is a student, create a student profile
      if (newUser.role === 'student') {
        try {
          const newStudent = new Student({
            userId: newUser._id,
            firstName: username,
            email: email,
            status: 'approved'
          });

          const savedStudent = await newStudent.save();
          console.log('Student profile created successfully:', savedStudent._id);
        } catch (studentError) {
          console.error('Error creating student profile:', studentError);
          // Delete the user if student profile creation fails
          await User.findByIdAndDelete(newUser._id);
          return res.status(500).json({ 
            message: 'Failed to create student profile',
            error: studentError.message 
          });
        }
      }
  
      // Generate JWT token
      const token = generateToken(newUser);
  
      return res.status(201).json({ 
        token, 
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          image: newUser.image,
        }
      });
    } catch (error) {
      console.error('Error in signup:', error);
      return res.status(500).json({ 
        message: 'Server error',
        error: error.message 
      });
    }
};

export const token = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Fetch the user from the database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a new token
      const newToken = generateToken(user);
  
      // Return user data and new token
      res.status(200).json({
        token: newToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          image: user.image,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user);

    // Return the token and user data
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerInstitute = async (req, res) => {
  const { name, email, password, contact, location, website, registrationNumber, description, logo } = req.body;
  console.log(req.body);

  try {
    // Step 1: Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create a new user for authentication
    const newUser = new User({
      username: name, // Use the institute name as the username
      email,
      password: hashedPassword,
      role: 'institute', // Set the role to 'institute'
      image: logo, // Add the logo as the user's image
    });

    await newUser.save();

    // Step 4: Create a new institute with the provided details
    const newInstitute = new Institute({
      name,
      email,
      contact,
      location,
      website,
      registrationNumber,
      description,
      logo,
      status: 'pending', // Set the status to 'pending' for admin approval
      userId: newUser._id, // Associate the institute with the user
      departments: [], // Initialize empty departments array
      facilities: [], // Initialize empty facilities array
      rating: 0, // Initialize rating
      totalReviews: 0, // Initialize total reviews
      featured: false, // Initialize featured status
    });

    await newInstitute.save();

    // Step 5: Generate a JWT token for the new user
    const token = generateToken(newUser);

    // Step 6: Return the token and user data
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
      institute: {
        id: newInstitute._id,
        name: newInstitute.name,
        status: newInstitute.status,
      }
    });
  } catch (error) {
    console.error('Error in registerInstitute:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerStudent = async (req, res) => {
  const { 
    username, email, password, image,
    firstName, lastName, gender, dateOfBirth, nationality,
    college, graduationYear, grade,
    phone, address,
    parentName, parentEmail, parentPhone,
    emergencyContactName, emergencyContactPhone,
    disability,
    cnicImage, fatherCnicImage, ResultImage12th, ResultImage10th, EntryTestImage
  } = req.body;

  try {
    // Step 1: Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create a new user for authentication
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'student',
      image,
    });

    await newUser.save();

    // Step 4: Create a new student profile
    const newStudent = new Student({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      nationality,
      college,
      graduationYear,
      grade,
      email,
      phone,
      address,
      parentName,
      parentEmail,
      parentPhone,
      emergencyContactName,
      emergencyContactPhone,
      disability,
      cnicImage,
      fatherCnicImage,
      ResultImage12th,
      ResultImage10th,
      EntryTestImage,
      userId: newUser._id,
      status: 'pending'
    });

    await newStudent.save();

    // Step 5: Generate a JWT token
    const token = generateToken(newUser);

    // Step 6: Return the token and user data
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
      student: {
        id: newStudent._id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        status: newStudent.status,
      }
    });
  } catch (error) {
    console.error('Error in registerStudent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};