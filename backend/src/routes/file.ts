import express, { Request, Response } from 'express';
import { errorHandler } from '../utils/errorHandler';
import { prisma } from '../entrypoint';
import { Prisma } from '@prisma/client';
export const filesRouter = express.Router();

/**
 * Create a file owned by a user
 * @route POST /file/add
 * @access Any User
 *
 * @body
 *  @requires
 *  @field ownerId (number)
 *  @desc userId of the User who creates this file
 *
 *  @requires
 *  @field name (string)
 *  @desc name of the file
 *
 *  @requires
 *  @field path (string)
 *  @desc absolute path of the file
 *
 *  @requires
 *  @field parentId (number)
 *  @desc directoryId of the parent directory
 *
 */

filesRouter.post('/add', async (req: Request, res: Response) => {
  let { ownerId, name, path, parentId } = req.body;
  if (!(ownerId && name && path && parentId)) {
    res
      .status(400)
      .send(
        'Missing parameter: make sure to specify ownerId, name, path, and parentId',
      );
    return;
  }

  try {
    const _existingUser = await prisma.user.findUnique({
      where: { id: ownerId },
    });
  } catch (err) {
    res.status(403).send({ Error: `User with id ${ownerId} does not exist` });
    return;
  }

  const fileData: Prisma.FileCreateInput = {
    parentId,
    ownerId,
    name,
    path,
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    const newFile = await prisma.file.create({
      data: fileData,
    });
    res.status(201).send(newFile);
  } catch (err) {
    res.status(500).send({ Error: err });
  }
});
