import { getPool } from './_db';

export default async function handler(req, res) {
  try {
    const [rows] = await getPool().query(
      'SELECT KeyID AS id, ProjectName AS name, FolderAddress1, FolderAddress2 FROM projectsmain'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
}
