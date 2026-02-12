import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translationAPI } from '../services/api';
import type { Translation } from '../types/translation';
import { arraysEqual } from '../utils/arrays';
import { useLyrics } from '../hooks/useLyrics';
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard';
import Lines from '../components/Lines';
import Flag from '../components/Flag';
import ConfirmLeaveModal from '../components/ConfirmLeaveModal';
import './EditTranslation.scss';

const EditTranslation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hookData = useLyrics();
  const initialRef = useRef<string[] | null>(null);
  const originalWrapperRef = useRef<HTMLDivElement | null>(null);
  const translationWrapperRef = useRef<HTMLDivElement | null>(null);
  const originalRefs = useRef<HTMLElement[]>([]);
  const translationRefs = useRef<HTMLElement[]>([]);

  const syncLineHeights = () => {
    const originalContainer = originalWrapperRef.current;
    const translationContainer = translationWrapperRef.current;

    if (!originalContainer || !translationContainer) return;

    const originalLines = originalContainer.querySelectorAll(".line");
    const translationLines = translationContainer.querySelectorAll(".line");

    const maxLines = Math.max(originalLines.length, translationLines.length);

    for (let i = 0; i < maxLines; i++) {
      const orig = originalLines[i] as HTMLElement | undefined;
      const trans = translationLines[i] as HTMLElement | undefined;

      if (!orig || !trans) continue;

      orig.style.height = "auto";
      trans.style.height = "auto";

      const maxHeight = Math.max(orig.offsetHeight, trans.offsetHeight);

      orig.style.height = `${maxHeight}px`;
      trans.style.height = `${maxHeight}px`;
    }
  };

  const hasUnsavedChanges =
    initialRef.current !== null && !arraysEqual(initialRef.current, hookData.translation);
  const guard = useUnsavedChangesGuard(hasUnsavedChanges);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await translationAPI.getTranslation(id);
        setTranslation(data);
        hookData.setupLyrics(data.originalLyrics, data.translatedLyrics);
        initialRef.current = data.translatedLyrics;
      } catch (err) {
        setError('Failed to load translation');
        console.error('Error fetching translation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [id]);

  useLayoutEffect(() => {
    syncLineHeights();
  }, [hookData.original, hookData.translation]);

  useEffect(() => {
    const originalContainer = originalWrapperRef.current;
    const translationContainer = translationWrapperRef.current;

    if (!originalContainer || !translationContainer) return;

    originalRefs.current = Array.from(
      originalContainer.querySelectorAll(".line")
    ) as HTMLElement[];
    translationRefs.current = Array.from(
      translationContainer.querySelectorAll(".line")
    ) as HTMLElement[];

    const observer = new ResizeObserver(() => {
      syncLineHeights();
    });
    document.addEventListener('resize', () => syncLineHeights)

    originalRefs.current.forEach((el) => el && observer.observe(el));
    translationRefs.current.forEach((el) => el && observer.observe(el));

    return () => {
      observer.disconnect()
      document.removeEventListener('resize', syncLineHeights)
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      syncLineHeights();
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);  
  }, [])

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

  const handleCancel = () => guard.tryLeave(() => navigate(-1));

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
      <ConfirmLeaveModal
        open={guard.showModal}
        onConfirm={guard.confirmNavigation}
        onCancel={guard.cancelNavigation}
      />
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
          <div className="lyrics-text original" ref={originalWrapperRef}>
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
          <div className="lyrics-editable" ref={translationWrapperRef}>
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
