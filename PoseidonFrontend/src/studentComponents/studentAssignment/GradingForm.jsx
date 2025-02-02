import React, { useState } from 'react';
import { FaStar, FaExclamationCircle, FaUpload, FaFile, FaTimes } from 'react-icons/fa';
import { supabase } from '../../supabase';

const GradingForm = ({ assignment, onSubmit }) => {
  const [answers, setAnswers] = useState('');
  const [selfAssessment, setSelfAssessment] = useState(0);
  const [confidence, setConfidence] = useState(3);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileUpload = async (event) => {
    try {
      const uploadedFiles = Array.from(event.target.files);
      setUploading(true);
      
      const uploadPromises = uploadedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${assignment.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('assignment-submissions')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('assignment-submissions')
          .getPublicUrl(filePath);

        return {
          name: file.name,
          url: publicUrl,
          path: filePath
        };
      });

      const uploadedFileUrls = await Promise.all(uploadPromises);
      setFiles([...files, ...uploadedFileUrls]);
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrors({ ...errors, files: 'Error uploading files' });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (fileToRemove) => {
    try {
      // Remove from storage
      const { error } = await supabase.storage
        .from('assignment-submissions')
        .remove([fileToRemove.path]);

      if (error) throw error;

      // Remove from state
      setFiles(files.filter(file => file.path !== fileToRemove.path));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!answers.trim()) {
      validationErrors.answers = 'Please provide your answers';
    }
    if (selfAssessment === 0) {
      validationErrors.selfAssessment = 'Please rate your understanding';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      // Create submission record
      const { data, error } = await supabase
        .from('AssignmentSubmissions')
        .insert([
          {
            assignmentId: assignment.id,
            studentId: session.user.id,
            content: answers,
            file_urls: files,
            confidence_level: confidence,
            self_assessment: selfAssessment,
            status: 'submitted'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      onSubmit(data);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setErrors({ submit: 'Error submitting assignment' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answers
        </label>
        <textarea
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          rows={6}
          className={`w-full rounded-lg border ${
            errors.answers ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          placeholder="Type your answers here..."
        />
        {errors.answers && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="mr-1" />
            {errors.answers}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Files
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload files</span>
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">Any file up to 10MB</p>
          </div>
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <FaFile className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Your Understanding (1-5)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setSelfAssessment(rating)}
              className={`p-2 rounded-full ${
                selfAssessment >= rating
                  ? 'text-yellow-400 hover:text-yellow-500'
                  : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              <FaStar size={24} />
            </button>
          ))}
        </div>
        {errors.selfAssessment && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="mr-1" />
            {errors.selfAssessment}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confidence Level
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Not Confident</span>
          <span>Very Confident</span>
        </div>
      </div>

      {errors.submit && (
        <p className="text-sm text-red-600 flex items-center">
          <FaExclamationCircle className="mr-1" />
          {errors.submit}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Submit Assignment'}
      </button>
    </form>
  );
};

export default GradingForm;