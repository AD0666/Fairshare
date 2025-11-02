import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: req.userId,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        _count: {
          select: {
            expenses: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Failed to get groups' });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, image, memberIds } = req.body;

    // Create group with creator as first member
    const group = await prisma.group.create({
      data: {
        name,
        image,
        createdBy: req.userId,
        members: {
          create: [
            { userId: req.userId },
            ...(memberIds && Array.isArray(memberIds)
              ? memberIds
                  .filter((id: string) => id !== req.userId)
                  .map((id: string) => ({ userId: id }))
              : []),
          ],
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Failed to create group' });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const group = await prisma.group.findFirst({
      where: {
        id,
        members: {
          some: {
            userId: req.userId,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Failed to get group' });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    // Check if user is creator
    const group = await prisma.group.findFirst({
      where: {
        id,
        createdBy: req.userId,
      },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or you are not the creator' });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(image !== undefined && { image }),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    res.json(updatedGroup);
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ message: 'Failed to update group' });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is creator
    const group = await prisma.group.findFirst({
      where: {
        id,
        createdBy: req.userId,
      },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or you are not the creator' });
    }

    await prisma.group.delete({
      where: { id },
    });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: 'Failed to delete group' });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    // Check if user is member of group
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: id,
        userId: req.userId,
      },
    });

    if (!groupMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Add members
    const members = await Promise.all(
      userIds.map(async (userId: string) => {
        if (userId === req.userId) return null;
        return prisma.groupMember.upsert({
          where: {
            groupId_userId: {
              groupId: id,
              userId,
            },
          },
          create: {
            groupId: id,
            userId,
          },
          update: {},
        });
      })
    );

    const validMembers = members.filter(Boolean);
    res.json({ message: 'Members added successfully', count: validMembers.length });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Failed to add members' });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    // Check permissions - user must be creator or removing themselves
    const group = await prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (userId === req.userId || group.createdBy === req.userId) {
      await prisma.groupMember.deleteMany({
        where: {
          groupId: id,
          userId,
        },
      });
      res.json({ message: 'Member removed successfully' });
    } else {
      res.status(403).json({ message: 'You do not have permission to remove this member' });
    }
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Failed to remove member' });
  }
};

