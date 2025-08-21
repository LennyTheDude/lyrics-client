import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translationAPI } from '../services/api';
import type { Translation } from '../types/translation';
import './Home.scss';

const Home: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        const data = await translationAPI.getTranslations();
        setTranslations(data.translations);
        setPagination({
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages
        });
      } catch (err) {
        setError('Failed to load translations');
        console.error('Error fetching translations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  if (loading) {
    return <div className="loading">Loading translations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <div className="home-header">
        <div className="header-info">
          <h1>Translations</h1>
          {pagination.total > 0 && (
            <p className="translation-count">
              Showing {translations.length} of {pagination.total} translations
            </p>
          )}
        </div>
        {user && (
          <Link to="/translation/new" className="btn btn-primary">
            Create New Translation
          </Link>
        )}
      </div>
      
      <div className="translations-list">
        {translations.length === 0 ? (
          <p>No translations found.</p>
        ) : (
          translations.map((translation) => (
            <div key={translation.id} className="translation-item">
              <div className="translation-info">
                <Link to={`/translation/${translation.id}`} className="translation-link">
                  {translation.artistName} - {translation.songName}
                </Link>
                <span className="translation-languages">
                  {translation.originalLanguage} → {translation.targetLanguage}
                </span>
              </div>
              {user && user.id === translation.author.id && (
                <Link to={`/translation/edit/${translation.id}`} className="btn btn-secondary">
                  Edit
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
