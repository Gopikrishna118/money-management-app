import { Response } from 'express';
import { getDB } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const loggedInUserId = req.user?.id;

  if (Number(id) !== loggedInUserId) {
    return res.status(403).json({ message: 'Unauthorized. You can only delete your own account.' });
  }

  try {
    const db = getDB();
    // Delete transactions first due to foreign key (if not CASCADE)
    await db.run('DELETE FROM transactions WHERE user_id = ?', [id]);
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'Account deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
