require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

/**
 * Get authenticated Drive client using OAuth2 with refresh token.
 * Uploads files as the actual Google account owner (rajeshsvglobal@gmail.com).
 */
const getDriveClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
};

/**
 * Uploads a file to Google Drive
 * @param {string} filePath - Path to the local file
 * @param {string} fileName - Name to save as in Drive
 * @returns {Promise<Object>} - Drive file ID and public URL
 */
const uploadFileToDrive = async (filePath, fileName, customFolderId = null) => {
  const folderId = (customFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID)?.trim();

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
    });

    // Make the file readable by anyone with the link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
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
