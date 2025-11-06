import Dartboard from '../components/Dartboard';

export default function Page() {
  return (
    <main className="container">
      <h1 className="title">Dartboard</h1>
      <div className="boardWrap">
        <Dartboard size={600} />
      </div>
      <p className="caption">Standard color scheme with numbered ring</p>
    </main>
  );
}
