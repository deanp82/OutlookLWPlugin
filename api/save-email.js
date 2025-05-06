import { getPool } from './_db';
import fs from 'fs/promises';

export default async function handler(req, res) {
  const { emailData, projectId } = req.body;
  try {
    const [[project]] = await getPool().query(
      'SELECT FolderAddress1, FolderAddress2 FROM projectsmain WHERE KeyID = ?',
      [projectId]
    );
    let basePath;
    if (project.FolderAddress2) {
      basePath = `${project.FolderAddress2}\\06 - Email Correspondence`;
    } else if (project.FolderAddress1) {
      basePath = `${project.FolderAddress1}\\01 - Email Correspondence`;
    } else {
      return res.status(400).send('No folders setup for this project');
    }
    const safeSubject = emailData.subject.replace(/[\\/:*?"<>|]/g, '-');
    const filename = `${basePath}\\${Date.now()}-${safeSubject}.txt`;
    await fs.writeFile(
      filename,
      `From: ${emailData.from}\nSubject: ${emailData.subject}\n\n${emailData.body}`
    );
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving email');
  }
}
