// Get single user data and display them
function getUserData(userId){

  //Load profile

  $.when( getProfileData(userId) ).then(function( profileData, textStatus, jqXHR ) {

    //Set name
    $("#nama").html(profileData.name);

    //Set profile picture
    $("#profile").attr("src",SERVER_URL+"../../uploads/"+profileData.profile_picture);

    //Fill data
    dataHTML = `

                <table class="table table-borderless">
                  <tbody>
                    <tr class="d-flex">
                      <td class="col-3">No TEC</td>
                      <td class="col-9">: `+ profileData.tec_regno +`</td>
                    </tr>
                    <tr class="d-flex">
                      <td class="col-3">NIM</td>
                      <td class="col-9">: `+ profileData.NIM +`</td>
                    </tr>
                    <tr class="d-flex">
                      <td class="col-3">Nama</td>
                      <td class="col-9">: `+ profileData.name +`</td>
                    </tr>
                    <tr class="d-flex">
                      <td class="col-3">Panggilan</td>
                      <td class="col-9">: `+ profileData.nick +`</td>
                    </tr>
                    <tr class="pb-3 d-flex">
                      <td class="col-3">Lunas</td>
                      <td class="col-9">: `+ getCheckCross(profileData.lunas) +`</td>
                    </tr>

                    <tr class="table-separator d-flex">
                      <td class="col-3">Email</td>
                      <td class="col-9">: `+ profileData.email +`</td>
                    </tr>
                    <tr class="d-flex">
                      <td class="col-3">No. Telp</td>
                      <td class="col-9">: `+ profileData.mobile +`</td>
                    </tr>
                    <tr class="d-flex">
                      <td class="col-3">ID LINE</td>
                      <td class="col-9">: `+ profileData.line_id +`</td>
                    </tr>
                    <tr class="d-flex">
                      <td class="col-3">ID Instagram</td>
                      <td class="col-9">: `+ profileData.instagram +`</td>
                    </tr>
                    <tr class="pb-3 d-flex">
                      <td class="col-3">Alamat</td>
                      <td class="col-9">: `+ profileData.address +`</td>
                    </tr>

                    <tr class="table-separator d-flex">
                      <td class="col-3">Tentang</td>
                      <td class="col-9">: `+ profileData.about_me +`</td>
                    </tr>
                    <tr class="d-flex">
                      <td class="col-3">Interest</td>
                      <td class="col-9">: `+ profileData.interests +`</td>
                    </tr>
                  </tbody>

                </table>
                <div id="quizScoreLoc">
                  <span onclick="getQuizScore('`+ userId+`');" class="mb-3 btn btn-primary">Get Quiz Score</span>
                </div>`;

      //Tampilkan isi data
      $("#userDataLoc").empty();
      $("#userDataLoc").append(dataHTML);

  },function( jqXHR, textStatus, errorThrown){
    alert("Failed to get profile : "+textStatus+"/"+jqXHR.statusText);
  });


}

// Get cross or check depending on result
function getCheckCross(data){
  if(data==0){
    return `<span class="fas fa-times-circle"></span>`;
  }else if(data==1){
    return `<span class="fas fa-check"></span>`;
  }
}

//Get user scor when requested
function getQuizScore(uid){
  //Remove existing table
  $("#quizScoreLoc table").remove();

  //Hide button and add loader
  $("#quizScoreLoc span").hide();
  $("#quizScoreLoc").append(`<div class="loader loader-small" id="loaderQuiz"></div>`)



  $.ajax({
    method: "GET",
    url: SERVER_URL+"/api/user/"+uid+"/score",
    headers: {"Authorization": "Bearer " + Cookies.get("token")}
  }).done(function(msg){
    //Set empty html
    var quizHTML=`
    <table class="table">
      <thead>
        <th>No.</th>
        <th>Judul Quiz</th>
        <th>Nilai</th>
      </thead>
      <tbody>
    `;

    $.each(msg,function(index,value){
      var nomor = index+1;
      quizHTML+=`
      <tr>
        <th>`+nomor+`</th>
        <td>`+value.title+`</td>
        <td>`+value.score+`</td>
      </tr>
      `;
    });

    //Close table
    quizHTML+=`
    </tbody>
    </table>
    `;

    //remove loader
    $("#loaderQuiz").remove();

    //show button
    $("#quizScoreLoc span").html("Refresh");
    $("#quizScoreLoc span").show();

    //show table
    $("#quizScoreLoc").append(quizHTML);


  }).fail(function(jqXHR,textStatus){
    alert( "Request failed: " + textStatus+"/"+ jqXHR.statusText );
  });
}


$(document).ready(function () {
   getUserData(Cookies.get("uid"));
});