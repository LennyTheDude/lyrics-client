import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translationAPI } from '../services/api';
import type { Language } from '../types/translation';
import './CreateTranslation.scss';

const CreateTranslation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [artistName, setArtistName] = useState('');
  const [songName, setSongName] = useState('');
  const [originalLanguage, setOriginalLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [originalLyrics, setOriginalLyrics] = useState('');
  const [fillWithOriginal, setFillWithOriginal] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const data = await translationAPI.getLanguages();
        setLanguages(data);
      } catch (err) {
        setError('Failed to load languages');
        console.error('Error fetching languages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleCreate = async () => {
    if (!artistName.trim() || !songName.trim() || !originalLanguage || !targetLanguage || !originalLyrics.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (originalLanguage === targetLanguage) {
      setError('Original and target languages must be different');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const translation = await translationAPI.createTranslation({
        artistName: artistName.trim(),
        songName: songName.trim(),
        originalLanguage: originalLanguage,
        targetLanguage: targetLanguage,
        originalLyrics: originalLyrics.split('\n'),
        fillWithOriginal: fillWithOriginal,
      });
      navigate(`/translation/edit/${translation.id}`);
    } catch (err) {
      setError('Failed to create translation');
      console.error('Error creating translation:', err);
    } finally {
      setCreating(false);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/404');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="loading">Loading languages...</div>;
  }

  if (!user) {
    return <div className="loading">Redirecting...</div>;
  }

  return (
    <div className="create-translation">
      <div className="create-header">
        <h1>Create New Translation</h1>
        <p>Enter the basic information about the song you want to translate</p>
      </div>

      <div className="create-form">
        <div className="form-layout">
          <div className="form-info-section">
            <div className="form-group">
              <label htmlFor="artistName">Artist Name</label>
              <input
                type="text"
                id="artistName"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Enter artist name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="songName">Song Name</label>
              <input
                type="text"
                id="songName"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                placeholder="Enter song name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="originalLanguage">Original Language</label>
              <select
                id="originalLanguage"
                value={originalLanguage}
                onChange={(e) => setOriginalLanguage(e.target.value)}
                className="form-select"
              >
                <option value="">Select original language</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="targetLanguage">Target Language</label>
              <select
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="form-select"
              >
                <option value="">Select target language</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label htmlFor="fillWithOriginal" className="checkbox-label">
                  Fill translation with original lyrics?
                </label>
                <input
                  type="checkbox"
                  id="fillWithOriginal"
                  checked={fillWithOriginal}
                  onChange={(e) => setFillWithOriginal(e.target.checked)}
                  className="form-checkbox"
                />
              </div>
              <p className="checkbox-description">
                When checked, the translation will be pre-filled with the original lyrics for easy editing.
              </p>
            </div>
          </div>

          <div className="form-lyrics-section">
            <div className="form-group">
              <label htmlFor="originalLyrics">Original Lyrics</label>
              <textarea
                id="originalLyrics"
                value={originalLyrics}
                onChange={(e) => setOriginalLyrics(e.target.value)}
                placeholder="Enter the original lyrics here..."
                className="form-textarea"
                rows={20}
              />
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={creating}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="btn btn-primary"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTranslation;
