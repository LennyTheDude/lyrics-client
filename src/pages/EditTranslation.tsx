import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translationAPI } from '../services/api';
import type { Translation } from '../types/translation';
import './EditTranslation.scss';

const EditTranslation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [translatedLyrics, setTranslatedLyrics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await translationAPI.getTranslation(id);
        setTranslation(data);
        setTranslatedLyrics(data.translatedLyrics);
      } catch (err) {
        setError('Failed to load translation');
        console.error('Error fetching translation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [id]);

  // Check if user can edit this translation after loading
  useEffect(() => {
    if (!loading && translation && (!user || user.id !== translation.author.id)) {
      navigate('/404');
    }
  }, [loading, translation, user, navigate]);

  const handleSave = async () => {
    if (!id || !translation) return;

    try {
      setSaving(true);
      await translationAPI.updateTranslation(id, { translatedLyrics });
      navigate(`/translation/${id}`);
    } catch (err) {
      setError('Failed to save translation');
      console.error('Error saving translation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading">Loading translation...</div>;
  }

  if (error || !translation) {
    return <div className="error">{error || 'Translation not found'}</div>;
  }

  // Check if user can edit this translation
  if (!user || user.id !== translation.author.id) {
    return <div className="loading">Redirecting...</div>;
  }

  return (
    <div className="edit-translation">
      <div className="edit-header">
        <div className="translation-title">
          <h1>Edit Translation</h1>
          <p>{translation.artistName} - {translation.songName}</p>
          <p className="translation-languages">
            {translation.originalLanguage} → {translation.targetLanguage}
          </p>
        </div>
        <div className="edit-actions">
          <button 
            onClick={handleCancel} 
            className="btn btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="translation-content">
        <div className="lyrics-section">
          <h2>Original Lyrics</h2>
          <div className="lyrics-text original">
            {translation.originalLyrics.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        <div className="lyrics-section">
          <h2>Translated Lyrics</h2>
          <div className="lyrics-editable">
            {translatedLyrics.map((line, index) => (
              <div
                key={index}
                contentEditable
                suppressContentEditableWarning
                className="lyrics-line"
                onBlur={(e) => {
                  const newLyrics = [...translatedLyrics];
                  newLyrics[index] = e.currentTarget.textContent || '';
                  setTranslatedLyrics(newLyrics);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newLyrics = [...translatedLyrics];
                    newLyrics.splice(index + 1, 0, '');
                    setTranslatedLyrics(newLyrics);
                    // Focus the next line
                    setTimeout(() => {
                      const nextLine = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextLine) {
                        nextLine.focus();
                      }
                    }, 0);
                  } else if (e.key === 'Backspace' && e.currentTarget.textContent === '') {
                    e.preventDefault();
                    if (translatedLyrics.length > 1) {
                      const newLyrics = [...translatedLyrics];
                      newLyrics.splice(index, 1);
                      setTranslatedLyrics(newLyrics);
                      // Focus the previous line
                      setTimeout(() => {
                        const prevLine = e.currentTarget.previousElementSibling as HTMLElement;
                        if (prevLine) {
                          prevLine.focus();
                        }
                      }, 0);
                    }
                  }
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default EditTranslation;
