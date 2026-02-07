import { useState } from 'react';

const useFileManager = () => {
    const [files, setFiles] = useState([]);

    const uploadFile = (file) => {
        setFiles((prevFiles) => [...prevFiles, file]);
        // Add additional logic to handle file upload
    };

    const removeFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
        // Add additional logic to handle file removal
    };

    const clearFiles = () => {
        setFiles([]);
    };

    return { files, uploadFile, removeFile, clearFiles };
};

export default useFileManager;