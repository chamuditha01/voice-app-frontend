import Header from "../../Components/Header";

const SpeakerDashboard3 = () => {

     const styles = {
    outerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      minHeight: "70vh",
      minWidth: "360px",
      boxSizing: "border-box",
      maxWidth: "360px",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "80vh",
      textAlign: "center",
    },
    profileCard: {
      alignItems: "center",
      width: "100%",
      maxWidth: "400px",
      marginBottom: "10px",
    },
    imageContainer: {
      width: "80%",
      height: "auto",
      borderRadius: "20px",
      margin: "10px auto",
      justifyContent: "center",
      alignItems: "center",
    },
    profileImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "20px",
    },
    infoContainer: {
      width: "100%",
      textAlign: "left",
      marginBottom: "20px",
      paddingLeft: "10px",
    },
    nameAndAge: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "0px",
      textAlign: "left",
    },
    location: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "5px",
      marginTop:'0px',
      textAlign: "left",
    },
    country: {
      fontSize: "18px",
      color: "#777",
      marginBottom: "auto",
    },
    endCallButton: {
      backgroundColor: "#e14e97",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      textTransform: "capitalize",
      fontFamily: "'Funnel Display', sans-serif",  
    },
  };


  const stylebutton2 = {
    width: "100%",
    padding: "15px 20px",
    backgroundColor: "#f9e7f3",
    color: "#e14e97",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease-in-out",
    marginTop: "20%",
    textTransform:"capitalize",
    fontFamily: "'Funnel Display', sans-serif",  
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px 20px",
    backgroundColor: "#e14e97",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease-in-out",
    textTransform:"capitalize",
    fontFamily: "'Funnel Display', sans-serif",  
  };

  
  const stylebutton3 = {
    width: "100%",
    padding: "15px 20px",
    backgroundColor: "#f9e7f3",
    color: "#e14e97",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease-in-out",
    marginTop: "10%",
    marginBottom: '10px',
    textTransform:"capitalize",
    fontFamily: "'Funnel Display', sans-serif",  
  };

  const handleEarningsClick = () => {
        // Navigate to upgrade subscription page
        window.history.back();
    }

    const handleBackClick = () => {
        // Navigate to previous page or dashboard
        window.history.back();
    }


    return (
        <div>
            <Header/>
<div style={styles.outerContainer}>
    <div style={{backgroundColor: "#f9e7f3", padding: "20px", borderRadius: "35px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "90%", maxWidth: "360px",margin:"0 auto"}}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      maxWidth: "360px",
                    }}
                  >
                    <div>
                      <h1 style={{ margin: "0px", color: "#000000" }}>
                       Hola, Speaker
                      </h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={
                          ""||
                          "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                        }
                        width={"50px"}
                        height={"50px"}
                        style={{
                          borderRadius: "10px",
                          objectFit: "cover",
                          margin: "0 auto",
                        }}
                        alt="Profile"
                      />
                    </div>
                  </div>
                    <div style={{display:'flex',flexDirection:'row',textAlign:'left'}}>
                <h4 style={{fontSize:'20px',margin:'0px'}}>200 Calls, </h4>
                    
                <h4 style={{fontSize:'20px', margin:'0px'}}>
  &nbsp;4/5 Score
</h4>
                   
                    </div>
                    <h4 style={{marginTop:"15%",marginBottom:"0px"}}>Total talk time</h4>
                  <h1 style={{ margin: "0px", color: "#000000" }}>
                      00:00:00
                    </h1>
                     <hr style={{ border: '0', height: '2px', backgroundColor: '#000', margin: '15px 0'}} />
                      <h4 style={{marginBottom:"0px"}}>Earnings</h4>
                  <h1 style={{ margin: "0px", color: "#000000" }}>
                      100.0$
                    </h1>
                  </div>
                  <button onClick={handleBackClick} style={stylebutton3}>
                    Back
                  </button>

                  <button onClick={handleEarningsClick} style={buttonStyle}>
                    Claim Earnings
                  </button>
                </div>
        </div>
    );
};

export default SpeakerDashboard3;