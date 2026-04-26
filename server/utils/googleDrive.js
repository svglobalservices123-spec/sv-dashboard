const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });


/**
 * Uploads a file to Google Drive
 * @param {string} filePath - Path to the local file
 * @param {string} fileName - Name to save as in Drive
 * @param {string} folderId - ID of the folder to upload to
 * @returns {Promise<Object>} - Drive file ID and public URL
 */
const uploadFileToDrive = async (filePath, fileName, folderId) => {
  try {
    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : [],
    };

    const media = {
      mimeType: getMimeType(filePath),
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // Make the file readable by anyone with the link (optional, but requested for admin)
    // Actually, service account files are private by default. 
    // We can grant permission to everyone or just return the link.
    // Given the requirement "Open uploaded documents (Google Drive links)", 
    // we might need to make them public or share with specific emails.
    // For now, let's just make it public for simplicity if needed, 
    // or just return the view link.
    
    await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    return {
      id: response.data.id,
      url: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.pdf': return 'application/pdf';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    default: return 'application/octet-stream';
  }
};

module.exports = { uploadFileToDrive };
