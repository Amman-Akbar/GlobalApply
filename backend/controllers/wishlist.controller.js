import Wishlist from '../models/wishlist.model.js';

export const addToWishlist = async (req, res) => {
  try {
    const { userId, instituteId, programId } = req.body;

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      userId,
      instituteId,
      programId
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Program already in wishlist'
      });
    }

    const wishlist = new Wishlist({
      userId,
      instituteId,
      programId
    });

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: 'Added to wishlist successfully',
      data: wishlist
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, instituteId, programId } = req.body;

    const result = await Wishlist.findOneAndDelete({
      userId,
      instituteId,
      programId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ userId })
      .populate({
        path: 'instituteId',
        select: 'name logo location image departments'
      })
      .sort({ createdAt: -1 });

    // Process the wishlist to include program details
    const processedWishlist = wishlist.map(item => {
      const [deptIndex, progIndex] = item.programId.split('-').map(Number);
      const program = item.instituteId.departments[deptIndex]?.programs[progIndex];
      
      return {
        ...item.toObject(),
        programDetails: program ? {
          name: program.name,
          semesterFee: program.semesterFee,
          duration: program.duration,
          levelofProgram: program.levelofProgram,
          department: item.instituteId.departments[deptIndex]?.name
        } : null
      };
    });

    res.status(200).json({
      success: true,
      data: processedWishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
};

export const checkWishlistStatus = async (req, res) => {
  try {
    const { userId, instituteId, programId } = req.query;

    const wishlist = await Wishlist.findOne({
      userId,
      instituteId,
      programId
    });

    res.status(200).json({
      success: true,
      data: {
        isInWishlist: !!wishlist
      }
    });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status',
      error: error.message
    });
  }
}; 