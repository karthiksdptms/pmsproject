import React from "react";

function Loading(){
    return(<>
     <div class="d-flex justify-content-center" style={{position:"relative",top:"200px"}}>
           <div class="spinner-border" role="status">
             <span class="sr-only"></span>
           </div>
         </div>
    </>)
}

export default Loading