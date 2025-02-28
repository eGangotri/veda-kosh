import React, { useState, useEffect } from 'react';
import { Mantra, MantraResponse } from '../../types/mantra';

const AnukramanikaView: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string>('');
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ'];
  const kaVarga = ['क', 'ख', 'ग', 'घ', 'ङ'];
  const chaVarga = ['च', 'छ', 'ज', 'झ', 'ञ'];
  const TaVarga = ['ट', 'ठ', 'ड', 'ढ', 'ण'];
  const taVarga = ['त', 'थ', 'द', 'ध', 'न'];
  const paVarga = ['प', 'फ', 'ब', 'भ', 'म'];
  const yaToLa = ['य', 'र', 'ल', 'व'];
  const shaToGya = ['श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'];

  const fetchMantras = async (char: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/mantras?startingChar=${encodeURIComponent(char)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mantras');
      }
      const data: MantraResponse = await response.json();
      setMantras(data.mantras);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMantras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (char: string) => {
    setSelectedChar(char);
    fetchMantras(char);
  };
  const x = 50;
  const xMd = 80
  const renderRow = (chars: string[]) => (
    <div className="flex flex-wrap gap-2">
      {chars.map((char, index) => (
        <button
          key={index}
          onClick={() => handleClick(char)}
          className={`
            w-${x} h-${x} md:w-${xMd} md:h-${xMd} 
            flex items-center justify-center 
            text-lg md:text-xl
            border rounded-lg
            transition-colors duration-200
            ${selectedChar === char 
              ? 'bg-blue-500 text-white border-blue-600' 
              : 'bg-white hover:bg-gray-100 border-gray-300'}
          `}
        >
          {char}
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <div className="space-y-4">
        {renderRow(vowels)}
        {renderRow(kaVarga)} {renderRow(chaVarga)}
        {renderRow(TaVarga)} {renderRow(taVarga)} {renderRow(paVarga)}
        {renderRow(yaToLa)} {renderRow(shaToGya)}
      </div>

      <div className="mt-8">
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4">
            {error}
          </div>
        )}

        {!loading && !error && mantras.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Mantras starting with: {selectedChar}
            </h2>
            <div className="grid gap-4">
              {mantras.map((mantra) => (
                <div 
                  key={mantra.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="text-lg font-devanagari">{mantra.text}</p>
                  {mantra.book && (
                    <p className="text-sm text-gray-600 mt-2">
                      Book: {mantra.book}, Chapter: {mantra.chapter}, Verse: {mantra.verse}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && mantras.length === 0 && selectedChar && (
          <p className="text-center text-gray-600">
            No mantras found starting with {selectedChar}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnukramanikaView;
