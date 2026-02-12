import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translationAPI } from '../services/api';
import type { Translation } from '../types/translation';
import './ViewTranslation.scss';
import { useLyrics } from '../hooks/useLyrics';
import Lines from '../components/Lines';
import Flag from '../components/Flag';

const ViewTranslation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hookData = useLyrics()
  const originalWrapperRef = useRef<HTMLDivElement | null>(null);
  const translationWrapperRef = useRef<HTMLDivElement | null>(null);

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

      orig.style.height = maxHeight + "px";
      trans.style.height = maxHeight + "px";
    }
  };

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

  useLayoutEffect(() => {
    syncLineHeights();
  }, [hookData.original, hookData.translation]);

  useEffect(() => {
    const originalContainer = originalWrapperRef.current;
    const translationContainer = translationWrapperRef.current;

    if (!originalContainer || !translationContainer) return;

    const observer = new ResizeObserver(() => {
      syncLineHeights();
    });

    observer.observe(originalContainer);
    observer.observe(translationContainer);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      syncLineHeights();
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);  
  }, [])

  if (loading) {
    return <div className="loading">Loading translation...</div>;
  }

  if (error || !translation) {
    return <div className="error">{error || 'Translation not found'}</div>;
  }

  const canEdit = user && user.id === translation.author.id;

  return (
    <div className="view-translation">
      <div className="translation-header">
        <div className="translation-title">
          <h1>{translation.artistName} - {translation.songName}</h1>
          <p className="translation-languages">
            <Flag code={translation.originalLanguage} /> → <Flag code={translation.targetLanguage} /> by {translation.author.username}
          </p>
        </div>
        {canEdit && (
          <Link to={`/translation/edit/${translation.id}`} className="btn btn-primary">
            Edit Translation
          </Link>
        )}
      </div>

      <div className="translation-content">
        <div className="lyrics-section">
          <h2>Original Lyrics</h2>
          <div className="lyrics-text" ref={originalWrapperRef}>
            <Lines
              lines={hookData.original}
              editable={false}
              tag="original"
              hoveredLine={hookData.hoveredLine}
              setHoveredLine={hookData.setHoveredLine}
            />
          </div>
        </div>

        <div className="lyrics-section">
          <h2>Translated Lyrics</h2>
          <div className="lyrics-text" ref={translationWrapperRef}>
            <Lines
              lines={hookData.translation}
              editable={false}
              tag="translation"
              hoveredLine={hookData.hoveredLine}
              setHoveredLine={hookData.setHoveredLine}
            />
          </div>
        </div>
      </div>

      <div className="translation-footer">
        <Link to="/" className="btn btn-secondary">
          Back to Translations
        </Link>
      </div>
    </div>
  );
};

export default ViewTranslation;
