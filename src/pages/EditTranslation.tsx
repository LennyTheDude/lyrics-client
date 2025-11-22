import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translationAPI } from '../services/api';
import type { Translation } from '../types/translation';
import './EditTranslation.scss';
import { useLyrics } from '../hooks/useLyrics';
import Lines from '../components/Lines';
import Flag from '../components/Flag';

const EditTranslation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hookData = useLyrics()

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await translationAPI.getTranslation(id);
        setTranslation(data);
        hookData.setupLyrics(data.originalLyrics, data.translatedLyrics)
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
      await translationAPI.updateTranslation(id, { translatedLyrics: hookData.translation });
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
            <Flag code={translation.originalLanguage} /> → <Flag code={translation.targetLanguage} />
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
            <Lines
              lines={hookData.original}
              editable={false}
              tag="original"
              hoveredLine={hookData.hoveredLine}
              setHoveredLine={hookData.setHoveredLine}
              activeLine={hookData.activeLine}
            />
          </div>
        </div>

        <div className="lyrics-section">
          <h2>Translated Lyrics</h2>
          <div className="lyrics-editable">
            <Lines
              lines={hookData.translation}
              editable={true}
              tag="translation"
              hoveredLine={hookData.hoveredLine}
              setHoveredLine={hookData.setHoveredLine}
              activeLine={hookData.activeLine}
              setActiveLine={hookData.setActiveLine}
              updateText={hookData.updateTranslation}
            />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default EditTranslation;
