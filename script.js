////////////////////////////////////////Drop down////////////////////////////

//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions

button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  showFile(); //calling function
});

function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
      let imgTag = `<img src="${fileURL}" alt="">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    fileReader.readAsDataURL(file);
  }else{
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}


/////////////////////////// download as pdf ///////////////////////////////////
window.onload = function () {
  document.getElementById("download")
      .addEventListener("click", () => {
          const invoice = this.document.querySelector(".invoicepage");
          console.log(invoice);
          console.log(window);
          var opt = {
              margin:0.2,
              filename: 'myfile.pdf',
              image: { type: 'jpeg', quality:1},
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
              hide: document.getElementById("hiderow").style.display = "none"
             };
          html2pdf().from(invoice).set(opt).save();
      })
}


//////////////////////////// calculation ///////////////////////////////
function roundNumber(number,decimals) {
  var newString;// The new rounded number
  decimals = Number(decimals);
  if (decimals < 1) {
    newString = (Math.round(number)).toString();
  } else {
    var numString = number.toString();
    if (numString.lastIndexOf(".") == -1) {// If there is no decimal point
      numString += ".";// give it one at the end
    }
    var cutoff = numString.lastIndexOf(".") + decimals;// The point at which to truncate the number
    var d1 = Number(numString.substring(cutoff,cutoff+1));// The value of the last decimal place that we'll end up with
    var d2 = Number(numString.substring(cutoff+1,cutoff+2));// The next decimal, after the last one we want
    if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
      if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
        while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
          if (d1 != ".") {
            cutoff -= 1;
            d1 = Number(numString.substring(cutoff,cutoff+1));
          } else {
            cutoff -= 1;
          }
        }
      }
      d1 += 1;
    } 
    if (d1 == 10) {
      numString = numString.substring(0, numString.lastIndexOf("."));
      var roundedNum = Number(numString) + 1;
      newString = roundedNum.toString() + '.';
    } else {
      newString = numString.substring(0,cutoff) + d1.toString();
    }
  }
  if (newString.lastIndexOf(".") == -1) {// Do this again, to the new string
    newString += ".";
  }
  var decs = (newString.substring(newString.lastIndexOf(".")+1)).length;
  for(var i=0;i<decimals-decs;i++) newString += "0";
  //var newNumber = Number(newString);// make it a number if you like
  return newString; // Output the result to the form field (change for your purposes)
}


//decimal number in sub-total
function update_total() {
  var total = 0;
  $('.price').each(function(i){
    price = $(this).html().replace("₹","");
    if (!isNaN(price)) total += Number(price);
  });

  total = roundNumber(total,2);

  $('.subtotal').html("₹"+total); 
  grand_total();
}

//update qty
function update_totalqty() {
  var quantity = 0;
  $('.qty').each(function(i){
    qty = $(this).val();
  if (!isNaN(qty)) quantity += Number(qty);
  });

  quantity=roundNumber(quantity,2);
  $('#totalqty').html(quantity);
}
 
$('.qty').change(update_totalqty);

 //display & update price
function update_price() {
  var row = $(this).parents('.item-row');
  var price = row.find('.cost').val().replace("₹","") * row.find('.qty').val();
  price = roundNumber(price,2);
  isNaN(price) ? row.find('.price').html("N/A") : row.find('.price').html("₹"+price);
  
  update_total();
}

function bind() {
  $(".cost").blur(update_price);
  $(".qty").blur(update_price);
  $(".qty").blur(update_totalqty);
  update_totalqty();
  $(".cost").blur(update_amount);
  $(".gstper").blur(update_amount);
  update_cgst();
  $('.qty').change(update_amount);
}

$(document).ready(function() {

  $('input').click(function(){
    $(this).select();
  });
  

  //Add the row in table
  $("#addrow").click(function(){
    $(".item-row:last").after('  <tr class="item-row"> <td class="item-name"><div class="delete-wpr"><textarea class="no">0</textarea><a class="delete" href="javascript:;" title="Remove row">X</a></div></td> <td class="desc"><textarea class="description">item name</textarea></td> <td class="uno"><textarea class="hsn">0</textarea></td> <td class="rate"><textarea class="cost">0.00</textarea></td> <td class="qun"><textarea class="qty">0</textarea></td> <td class="per"><textarea class="gstper">0</textarea></td> <td class="amount"><span class="gstamount">₹0.00</span></td> <td><span class="price">₹0.00</span></td> </tr>  ');

    if ($(".delete").length > 0) $(".delete").show();
    bind();
    
  });
  
  bind();

  //delete the row in table
  $(".delete").live('click',function(){
    $(this).parents('.item-row').remove();
    update_total();
    update_totalqty();
    update_cgst();
    update_gst();
    if ($(".delete").length < 2) $(".delete").hide();
  });
  
});


//tax table
function update_cgst() {
  var ctotal = 0;
  $('.gstamount').each(function(i){
    amount = $(this).html().replace("₹","");
    if (!isNaN(amount)) ctotal += Number(amount);
  });

  ctotal = roundNumber(ctotal,2);
  $('.gsttotal').html("₹"+ctotal);
}

function update_amount() {
  var row = $(this).parents('.item-row');
  var amount = (row.find('.cost').val().replace("₹","")*row.find('.qty').val()) /100 * row.find('.gstper').val();
  amount = roundNumber(amount,2);
  isNaN(amount) ? row.find('.gstamount').html("N/A") : row.find('.gstamount').html("₹"+amount);
  
  update_cgst();
  update_gst();
}
$('.qty').change(update_amount);  

//final cgst and sgst 
function update_gst() {
  var ctotal = 0;
  $('.gstamount').each(function(i){
    amount = $(this).html().replace("₹","");
    if (!isNaN(amount)) ctotal += Number(amount)/2;
  });

  ctotal = roundNumber(ctotal,2);
  $('.gst').html("₹"+ctotal);
  grand_total();
}

//Grand total
function grand_total() {
  var gtotal = 0;
  $('.value').each(function(i){
    value = $(this).html().replace("₹","");
    gtotal += Number(value);
  });

  word=gtotal;
  gtotal = roundNumber(gtotal,2);

  $('.Total').html("₹"+gtotal);
  var hi=toWordsconver(word);
  $('.space').html(hi+"Rupees only");
}

//var ftotal=grand_total();


////////////////////////////////////////////////////////grand total amount(number) into word///////////////////////////////////////////////////

// System for American Numbering 
var th_val = ['', 'thousand', 'million', 'billion', 'trillion'];
// System for uncomment this line for Number of English 
// var th_val = ['','thousand','million', 'milliard','billion'];
 
var dg_val = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn_val = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw_val = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function toWordsconver(s) {
  s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s))
        return 'not a number ';
    var x_val = s.indexOf('.');
    if (x_val == -1)
        x_val = s.length;
    if (x_val > 15)
        return 'too big';
    var n_val = s.split('');
    var str_val = '';
    var sk_val = 0;
    for (var i = 0; i < x_val; i++) {
        if ((x_val - i) % 3 == 2) {
            if (n_val[i] == '1') {
                str_val += tn_val[Number(n_val[i + 1])] + ' ';
                i++;
                sk_val = 1;
            } else if (n_val[i] != 0) {
                str_val += tw_val[n_val[i] - 2] + ' ';
                sk_val = 1;
            }
        } else if (n_val[i] != 0) {
            str_val += dg_val[n_val[i]] + ' ';
            if ((x_val - i) % 3 == 0)
                str_val += 'hundred ';
            sk_val = 1;
        }
        if ((x_val - i) % 3 == 1) {
            if (sk_val)
                str_val += th_val[(x_val - i - 1) / 3] + ' ';
            sk_val = 0;
        }
    }
    if (x_val != s.length) {
        var y_val = s.length;
        str_val += 'point ';
        for (var i = x_val + 1; i < y_val; i++)
            str_val += dg_val[n_val[i]] + ' ';
    }
    return str_val.replace(/\s+/g, ' ');
}






