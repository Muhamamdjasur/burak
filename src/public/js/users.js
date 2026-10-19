console.log("Users frontend javascript file");

$(function () {
  $(".member-status").on("change", function () {
    const id = this.id,
          memberStatus = this.value;

    if (!id) {
      console.error("User ID bo‘sh! EJS dagi select elementni tekshir.");
      return;
    }
  
    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        console.log("result:", response.data);

        if (response.data.data) {
          console.log("User updated!");
          this.blur();
        } else {
          alert("User update failed!");
        }
      })
      .catch((err) => {
        console.error("Update error:", err.response?.data || err);
        alert("User update failed!");
      });
  });
});