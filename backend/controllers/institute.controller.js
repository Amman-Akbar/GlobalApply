import Institute from "../models/institute.model.js";
import User from "../models/user.model.js";

// GET all institutes
export const getAllInstitutes = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    const institutes = await Institute.find(query);
    res.status(200).json({ success: true, data: institutes });
  } catch (error) {
    console.error("Error getting institutes:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET a single institute by ID
export const getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ success: false, message: "Institute not found" });
    }
    res.status(200).json({ success: true, data: institute });
  } catch (error) {
    console.error("Error getting institute by ID:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST (Create) a new institute
export const addInstitute = async (req, res) => {
  try {
    const instituteData = req.body;
    if (!instituteData) {
      return res.status(400).json({ success: false, message: "Institute data is required" });
    }

    // Check if userId is provided
    if (!instituteData.userId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId is required for creating an institute" 
      });
    }

    // Verify that the user exists
    const user = await User.findById(instituteData.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found with the provided userId" 
      });
    }

    // Verify that the user has the institute role
    if (user.role !== 'institute') {
      return res.status(400).json({ 
        success: false, 
        message: "User must have the institute role" 
      });
    }

    const newInstitute = await Institute.create(instituteData);
    res.status(201).json({ success: true, data: newInstitute });
  } catch (error) {
    console.error("Error adding institute:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT (Update) an existing institute by ID
export const updateInstitute = async (req, res) => {
  try {
    const updatedInstitute = await Institute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedInstitute) {
      return res.status(404).json({ success: false, message: "Institute not found" });
    }
    res.status(200).json({ success: true, data: updatedInstitute });
  } catch (error) {
    console.error("Error updating institute:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE an institute by ID
export const deleteInstitute = async (req, res) => {
  try {
    const deletedInstitute = await Institute.findByIdAndDelete(req.params.id);
    if (!deletedInstitute) {
      return res.status(404).json({ success: false, message: "Institute not found" });
    }
    res.status(200).json({ success: true, message: "Institute deleted successfully" });
  } catch (error) {
    console.error("Error deleting institute:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET institute by user ID
export const getInstituteByUserId = async (req, res) => {
  try {
    console.log('Fetching institute for user ID:', req.params.userId);
    const institute = await Institute.findOne({ userId: req.params.userId });
    
    if (!institute) {
      console.log('No institute found for user ID:', req.params.userId);
      return res.status(404).json({ 
        success: false, 
        message: "Institute not found for this user" 
      });
    }

    console.log('Institute found:', institute._id);
    res.status(200).json({ success: true, data: institute });
  } catch (error) {
    console.error("Error getting institute by user ID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error",
      error: error.message 
    });
  }
};

export const getFeaturedInstitutes = async (req, res) => {
  try {
    const lahore = await Institute.find({ location: "Lahore", featured: true }).limit(4);
    const karachi = await Institute.find({ location: "Karachi", featured: true }).limit(4);
    const islamabad = await Institute.find({ location: "Islamabad", featured: true }).limit(4);
    
    res.status(200).json({
      success: true,
      data: { Lahore: lahore, Karachi: karachi, Islamabad: islamabad }
    });
  } catch (error) {
    console.error("Error fetching featured institutes:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getLatestListings = async (req, res) => {
  try {
    const listings = await Institute.aggregate([
      { $unwind: "$departments" },
      { $unwind: "$departments.programs" },
      {
        $project: {
          university: "$name",
          logo: "$logo",
          city: "$location",
          program: "$departments.programs.name",
          deadline: "$departments.programs.deadline",
          levelofProgram: "$departments.programs.levelofProgram",
        },
      },
      { 
        $group: { 
          _id: "$levelofProgram", 
          programs: { $push: "$$ROOT" } 
        } 
      },
      { 
        $project: { 
          _id: 1, 
          programs: { $slice: ["$programs", 4] } // ✅ Limit to 4 listings per category
        } 
      }
    ]);

    // Convert array to object { "Undergraduate": [...], "Graduate": [...] }
    const groupedListings = {};
    listings.forEach((item) => {
      groupedListings[item._id] = item.programs;
    });

    res.status(200).json({ success: true, data: groupedListings });
  } catch (error) {
    console.error("Error fetching latest listings:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getActiveInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.aggregate([
      {
        $match: {
          status: 'approved',
          'departments.programs.isActive': true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          location: 1,
          departments: {
            $filter: {
              input: '$departments',
              as: 'dept',
              cond: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$$dept.programs',
                        as: 'prog',
                        cond: { $eq: ['$$prog.isActive', true] }
                      }
                    }
                  },
                  0
                ]
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({ 
      success: true,
      data: institutes 
    });
  } catch (error) {
    console.error("Error fetching active institutes:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch active institutes" 
    });
  }
};

export const getTrendingInstitutes = async (req, res) => {
  try {
    // Fetch all institutes from the database
    const institutes = await Institute.find({});

    // Define the trending categories.
    // (These keys should match the ones your frontend expects.)
    const trendingCategories = ["computer-science", "medical", "electrical"];

    // Initialize the result object with empty arrays for each category
    const trendingData = {};
    trendingCategories.forEach((category) => {
      trendingData[category] = [];
    });

    // Loop over each institute and group it by trending category
    institutes.forEach((institute) => {
      if (Array.isArray(institute.departments)) {
        institute.departments.forEach((department) => {
          // Convert department name to lowercase for comparison
          const depName = department.name.toLowerCase();
          trendingCategories.forEach((category) => {
            // Replace hyphen with space for matching if needed.
            // For example, "computer-science" becomes "computer science".
            const keyword = category.replace("-", " ");
            if (depName.includes(keyword)) {
              trendingData[category].push(institute);
            }
          });
        });
      }
    });

    // Limit each category to a maximum of 4 institutes
    trendingCategories.forEach((category) => {
      trendingData[category] = trendingData[category].slice(0, 4);
    });

    res.status(200).json({ data: trendingData });
  } catch (error) {
    console.error("Error fetching trending institutes:", error);
    res.status(500).json({ message: "Failed to fetch trending institutes" });
  }
};

// Approve an institute
export const approveInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true, runValidators: true }
    );

    if (!institute) {
      return res.status(404).json({ success: false, message: "Institute not found" });
    }

    res.status(200).json({ success: true, data: institute });
  } catch (error) {
    console.error("Error approving institute:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Reject an institute
export const rejectInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true, runValidators: true }
    );

    if (!institute) {
      return res.status(404).json({ success: false, message: "Institute not found" });
    }

    res.status(200).json({ success: true, data: institute });
  } catch (error) {
    console.error("Error rejecting institute:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

