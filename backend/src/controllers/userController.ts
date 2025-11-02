import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: email,
          mode: 'insensitive',
        },
        id: {
          not: req.userId, // Exclude current user
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
      },
      take: 10,
    });

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone, profilePicture } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(profilePicture !== undefined && { profilePicture }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePicture: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        phone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.params;

    if (friendId === req.userId) {
      return res.status(400).json({ message: 'Cannot add yourself as friend' });
    }

    // Check if friend exists
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: req.userId, friendId },
          { userId: friendId, friendId: req.userId },
        ],
      },
    });

    if (existingFriendship) {
      return res.status(400).json({ message: 'Friendship already exists' });
    }

    await prisma.friendship.create({
      data: {
        userId: req.userId,
        friendId,
      },
    });

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Failed to add friend' });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        friend: {
          select: {
            id: true,
            email: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    const friends = friendships.map(f => f.friend);
    res.json(friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Failed to get friends' });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.params;

    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId: req.userId, friendId },
          { userId: friendId, friendId: req.userId },
        ],
      },
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Failed to remove friend' });
  }
};

