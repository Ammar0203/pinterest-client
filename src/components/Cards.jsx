import { useCallback, useRef, useState } from "react";
import usePin from "../hooks/usePin";
import Card from "./Card";
import './styles/Cards.css'

export default function Cards({query}) {
  const [pageNumber, setPageNumber] = useState(1);

  const { pins, hasMore, loading, error } = usePin({ query, pageNumber });

  const observer = useRef();
  const lastPinElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    pins.length > 0 ?
      <>
        <div className="Home-pin-container">
          {pins.map((pin, index) => {
            if (pins.length === index + 1) {
              return (
                <Card innerRef={lastPinElementRef} key={pin.name} pin={pin} />
              );
            } else {
              return <Card key={pin._id} pin={pin} />;
            }
          })}
        </div>
        {!hasMore &&
          <div style={{fontSize: '2rem', fontWeight: 600, width: '100%', textAlign: 'center', marginTop: 36, opacity: 0.7}}>
            that's it...
          </div>
        }
      </>
      :
      <div style={{fontSize: '2rem', fontWeight: 600, width: '100%', textAlign: 'center', marginTop: 36, opacity: 0.7}}>
        no pins yet...
      </div>
  );
}