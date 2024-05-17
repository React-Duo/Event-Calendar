import "./ContentPublic.css";

const ContentPublic = () => {
  return (
    <div className="content-public">
      <div className="title-public">
        <h1>Simplified Event Scheduling</h1>
        <p>
          Calendo offers seamless event management and an easy way to explore
          all the coolest events. Say goodbye to chaos and hello to organized,
          enjoyable planning.
        </p>
      </div>
      <div>
        <img
          className="content-public-img"
          src="https://picsum.photos/900/500"
          alt="demo"
        />
      </div>
      <div className="partners">
        <h3>Simplified scheduling for more than 20 million users worldwide</h3>
        <div className="partners-logos">
          <img src="https://picsum.photos/200/50" alt="partner" />
          <img src="https://picsum.photos/200/50" alt="partner" />
          <img src="https://picsum.photos/200/50" alt="partner" />
          <img src="https://picsum.photos/200/50" alt="partner" />
        </div>
      </div>
    </div>
  );
};

export default ContentPublic;
