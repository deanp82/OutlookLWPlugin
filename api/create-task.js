import { getPool } from './_db';

export default async function handler(req, res) {
  const {
    projectId, assigned_to_email, description, notes,
    deadline_date, set_reminder, add_to_outlook
  } = req.body;

  try {
    await getPool().execute(
      `INSERT INTO tasks
        (project_id, assigned_to_email, description, notes,
         deadline_date, set_reminder, added_to_outlook)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId, assigned_to_email, description, notes,
        deadline_date, set_reminder ? 1 : 0, add_to_outlook ? 1 : 0
      ]
    );
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating task');
  }
}
