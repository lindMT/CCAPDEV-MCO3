console.log("asdfklasgdiofasgdklfjhasdkljf")
$(document).ready(function()
{
  // Write a comment
  new Vue({
    el: "#app",
    data:{
      title: 'Add a comment',
      newItem: '',
      item: [],
    },
    methods:{
      addItem  (){
      this.item.push(this.newItem);
        this.newItem = "";
      }
  }
  });

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  } 
  if(mm<10){
    mm='0'+mm
  } 
  document.write("asdfqalsukdgfklasdghfklajsdghfkljashfklasgfiklasghfklashfkljashfjklashdfjklasdhfkljasdhfkljashdf")

  today = yyyy+'-'+mm+'-'+dd;
  document.getElementById("endSellingDate").setAttribute("min", today);

  console.log("asdflasjkdfhajksdhfjklashfklasjfhklasjh")
});