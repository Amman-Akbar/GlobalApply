import Application from '../models/application.model.js';

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { student, institute, program, additionalInfo } = req.body;
    const application = await Application.create({
      student,
      institute,
      program,
      additionalInfo,
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applications (admin)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'username email')
      .populate('institute', 'name email');
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications by student
export const getApplicationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await Application.find({ student: studentId })
      .populate('institute', 'name email');
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications by institute
export const getApplicationsByInstitute = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const applications = await Application.find({ institute: instituteId })
      .populate('student', 'username email');
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await Application.findByIdAndDelete(id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 