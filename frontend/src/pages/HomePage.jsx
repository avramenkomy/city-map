import { useEffect, useState } from 'react';

import { getPlaces } from '../api/placesApi';

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await getPlaces();
        setPlaces(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaces();
  }, []);

  if (isLoading) {
    return <p>Загружаем места...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>Городская карта мест</h1>
        <p>Список мест из Django API.</p>
      </section>

      <section className="places-list">
        {places.length === 0 ? (
          <p>Пока нет добавленных мест.</p>
        ) : (
          places.map((place) => (
            <article className="place-card" key={place.id}>
              <h2>{place.title}</h2>
              <p>{place.description || 'Описание пока не добавлено.'}</p>
              <p>Категория: {place.category?.name || 'Без категории'}</p>
              <p>
                Координаты: {place.latitude}, {place.longitude}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default HomePage;
