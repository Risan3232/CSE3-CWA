export default function About() {
  return (
    <div className="card">
      <h1 style={{marginTop:0}}>About</h1>
      <p>
        Name: Risan Shrestha
        <br />
        Student number: 21662159
      </p>
      <p>How to use: Fill in the inputs on the Home page, copy the generated HTML and paste it into a .html file or Moodle HTML block.</p>
      <div style={{position:"relative", paddingTop:"56.25%", borderRadius:8, overflow:"hidden", border:"1px solid #555", background:"#000"}}>
        <iframe
          title="How to use this website"
          src=""
          style={{position:"absolute", inset:0, width:"100%", height:"100%", border:0}}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
