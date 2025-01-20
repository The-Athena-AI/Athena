import React, { useState } from 'react';
import { FaBook, FaChevronDown, FaChevronUp, FaDownload } from 'react-icons/fa';

const LectureNotes = ({ notes = [] }) => {
  const [expandedNote, setExpandedNote] = useState(null);

  if (!notes || notes.length === 0) {
    return null;
  }

  const handleDownload = (url, filename) => {
    // Implementation for downloading notes
    console.log('Downloading:', filename, 'from', url);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Related Lecture Notes</h3>
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => setExpandedNote(expandedNote === index ? null : index)}
            >
              <div className="flex items-center gap-3">
                <FaBook className="text-blue-500" />
                <div>
                  <h4 className="font-medium">{note.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {expandedNote === index ? (
                <FaChevronUp className="text-gray-400" />
              ) : (
                <FaChevronDown className="text-gray-400" />
              )}
            </div>

            {expandedNote === index && (
              <div className="p-4 border-t border-gray-200">
                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700">{note.content}</p>
                </div>
                {note.attachments && note.attachments.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Attachments
                    </h5>
                    <div className="space-y-2">
                      {note.attachments.map((attachment, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            handleDownload(attachment.url, attachment.filename)
                          }
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FaDownload size={14} />
                          <span>{attachment.filename}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LectureNotes;