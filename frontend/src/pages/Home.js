import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Select your role</h2>
      <Link to="/login/patient"><button>Patient</button></Link>
      <Link to="/login/doctor"><button>Doctor</button></Link>
      <Link to="/login/authority"><button>Authority</button></Link>
      <Link to="/login/pharmacy"><button>Pharmacy</button></Link>
    </div>
  );
}

export default Home;
