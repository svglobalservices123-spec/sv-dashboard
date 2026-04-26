require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

/**
 * Get authenticated Drive client using Service Account credentials.
 */
const getDriveClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
};

/**
 * Uploads a file to Google Drive
 * @param {string} filePath - Path to the local file
 * @param {string} fileName - Name to save as in Drive
 * @returns {Promise<Object>} - Drive file ID and public URL
 */
const uploadFileToDrive = async (filePath, fileName) => {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();

  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is not defined. Upload aborted.');
  }

  console.log('DEBUG: Uploading', fileName, '→ Folder:', folderId);

  const drive = getDriveClient();

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: getMimeType(filePath),
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
      supportsAllDrives: true,
    });

    // Make the file readable by anyone with the link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
    });

    console.log('DEBUG: Upload successful. File ID:', response.data.id);

    return {
      id: response.data.id,
      url: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error.message);
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
