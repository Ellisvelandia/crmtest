/**
 * Utility function to download a file with given content
 * @param content The content of the file
 * @param filename The name of the file to be downloaded
 * @param type The MIME type of the file
 */
export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export default {
  downloadFile
}; 