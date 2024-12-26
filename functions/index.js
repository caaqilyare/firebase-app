const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.listUsers = functions.https.onRequest(async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    res.json({ users: listUsersResult.users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.deleteUser = functions.https.onRequest(async (req, res) => {
  try {
    const { uid } = req.body;
    await admin.auth().deleteUser(uid);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 