document.addEventListener("DOMContentLoaded", function () {
    const typeDropdown = document.getElementById("type");
    const destinationDropdown = document.getElementById("destination");
    const formContainer = document.querySelector(".form-container");
      const lengthInput = document.getElementById("length");  
const heightInput = document.getElementById("height");  
const widthInput = document.getElementById("width");     
const weightInput = document.getElementById("weight");   
    // Data for destinations based on type
    const destinationOptions = {
        Express: [
        "OMAN", "UAE", "QATAR", "BELGIUM", "FRANCE", "GERMANY", "ITALY", "NETHERLANDS", "SPAIN", 
        "UNITED KINGDOM", "CANADA", "CHINA", "HONG KONG", "USA", "ALGIERS", "INDIA", "PORTUGAL", 
        "TURKEY", "BRAZIL", "TAIWAN", "SWITZERLAND", "BAHRAIN", "EGYPT", "LEBANON", "KUWAIT", 
        "SAUDI ARABIA", "WEST BANK", "TUNISIA", "SOUTH KOREA", "CYPRUS", "IRAQ", "JERSEY CI", 
        "IRELAND", "SENEGAL", "MONACO", "AUSTRIA", "DENMARK", "FINLAND", "GREECE", "LUXEMBOURG", 
        "PAKISTAN", "SINGAPORE", "SWEDEN", "ICELAND", "INDONESIA", "MALAYSIA", "NEW ZEALAND", 
        "PHILIPPINES", "SRI LANKA", "THAILAND", "BRUNEI", "CHILE", "CZECH", "HUNGARY", "JAPAN", 
        "MOROCCO", "RUSSIA", "SOUTH AFRICA"
    ],
    Cargo: [
        "OMAN", "UAE", "QATAR", "BELGIUM", "FRANCE", "GERMANY", "ITALY", "NETHERLANDS", "SPAIN", 
        "UNITED KINGDOM", "CANADA", "CHINA", "HONG KONG", "USA", "ALGIERS", "INDIA", "PORTUGAL", 
        "TURKEY", "BRAZIL", "TAIWAN", "SWITZERLAND", "BAHRAIN", "EGYPT", "LEBANON", "KUWAIT", 
        "SAUDI ARABIA", "WEST BANK", "TUNISIA", "SOUTH KOREA", "CYPRUS", "IRAQ", "JERSEY CI", 
        "IRELAND", "SENEGAL", "MONACO", "AUSTRIA", "DENMARK", "FINLAND", "GREECE", "LUXEMBOURG", 
        "PAKISTAN", "SINGAPORE", "SWEDEN", "ICELAND", "INDONESIA", "MALAYSIA", "NEW ZEALAND", 
        "PHILIPPINES", "SRI LANKA", "THAILAND", "BRUNEI", "CHILE", "CZECH", "HUNGARY", "JAPAN", 
        "MOROCCO", "RUSSIA", "SOUTH AFRICA"
    ],
        Sea: ["BARCELONA", "SHANGHAI", "GENOA", "NEW YORK"],
        Land: ["RUH-KSA", "DXB", "KWI"],
    };

    function updateDestinations() {
        // Clear current options
        destinationDropdown.innerHTML = "";

        // Remove any additional dropdowns if they exist
        const additionalDropdowns = document.querySelectorAll(".additional-dropdown");
        additionalDropdowns.forEach((dropdown) => dropdown.remove());

        // Get the selected type
        const selectedType = typeDropdown.value;

        // Populate destination options based on type
        if (destinationOptions[selectedType]) {
            destinationOptions[selectedType].forEach((destination) => {
                const option = document.createElement("option");
                option.value = destination;
                option.textContent = destination;
                destinationDropdown.appendChild(option);
            });

            // Add additional dropdowns for Sea and Land
            if (selectedType === "Sea" || selectedType === "Land") {  
              createAdditionalDropdown(selectedType);
            disableInputs(true);  // ADDED: Disable inputs
        } else {
            disableInputs(false); // ADDED: Enable inputs for other types
        }
        } else {
            // Show default or empty message if no destinations available
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No destinations available";
            destinationDropdown.appendChild(option);
        }
    }
    
     function disableInputs(disable) {
        lengthInput.disabled = disable;
        heightInput.disabled = disable;
        widthInput.disabled = disable;
        weightInput.disabled = disable;
    }

function createAdditionalDropdown(type) {
    const additionalDropdown = document.createElement("div");
    additionalDropdown.className = "input-group additional-dropdown";

    const label = document.createElement("label");
    label.textContent = "CPM:"; // Label for the new dropdown
    additionalDropdown.appendChild(label);

    const select = document.createElement("select");
    select.className = "cpm-select"; // Add a class for easy reference
    
    const options = ["20", "40"];
    options.forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        select.appendChild(option);
    });

    additionalDropdown.appendChild(select);
    formContainer.insertBefore(additionalDropdown, document.getElementById("calculate-btn")); // Position it before the calculate button
}


    // Initialize destinations on page load
    updateDestinations();

    // Update destinations when the type changes
    typeDropdown.addEventListener("change", updateDestinations);
});
document.getElementById("calculate-btn").addEventListener("click", function() {
  let weight = parseFloat(document.getElementById("weight").value);
  const type = document.getElementById("type").value;
  const destination = document.getElementById("destination").value;
  const length = parseFloat(document.getElementById("length").value);
  const height = parseFloat(document.getElementById("height").value);
  const width = parseFloat(document.getElementById("width").value);

  // Get the value of the CPM dropdown if it's visible
    let cpmValue = '';
    const cpmSelect = document.querySelector(".cpm-select"); // Use the class assigned to the CPM dropdown
    if (cpmSelect) {
        cpmValue = cpmSelect.value; // Get the selected value
    }
  let cost = 0;
  let finalWeight = weight;
  let resultMessage = '';
  
  // Calculate Y using the formula
  const Y = (length * height * width) / 5000;

  // Compare Y with weight, use the greater value for shipping cost calculation
    if(type !== "Sea" || type !== "Land")
    {
  if (Y >= weight) {
    finalWeight = Y;
    resultMessage = "Using calculated value dimensional weight for shipping cost.";
  } else {
    finalWeight = weight;
    resultMessage = "Using provided weight for shipping cost.";
  }
    }
  // Automatically set the type to "Cargo" if weight is 120 or more        
  if (finalWeight >= 120 && type !== "Cargo" && type !== "Y") {
    document.getElementById("type").value = "Cargo"; // Change the select value to Cargo
    resultMessage += " Weight is 120kg or more, setting shipping type to Cargo.";
  }

  // Cap weight to 500 if it exceeds that value
  if (finalWeight > 500) {
    finalWeight = 500;
    resultMessage += " Weight exceeded 500kg, capping it to 500kg.";
  }

  // Validate input fields
  // if (!finalWeight || !destination) {
  //   document.getElementById("result").textContent = "Please enter valid values for weight and destination.";
  //   return;
  // }

  // Calculate cost based on type and destination
  if (type === "Express") {
    if (destination === "OMAN" || destination === "UAE" || destination === "QATAR") {
      cost = 2.8728 * finalWeight + 13.205;
    } else if (destination === "BELGIUM" || destination === "FRANCE" || destination === "GERMANY" ||
               destination === "ITALY" || destination === "NETHERLANDS" || destination === "SPAIN" ||
               destination === "UNITED KINGDOM") {
      cost = 4.1883 * finalWeight + 26.266;
    } else if (destination === "CANADA" || destination === "CHINA" || destination === "HONGKONG" || destination === "USA") {
      cost = 4.5756 * finalWeight + 18.714;
    } else if (destination === "ALGIERS" || destination === "INDIA" || destination === "PORTUGAL" || destination === "TURKEY") {
      cost = 4.6749 * finalWeight + 26.002;
    } else if (destination === "BRAZIL") {
      cost = 5.8967 * finalWeight + 27.153;
    } else if (destination === "TAIWAN" || destination === "SWISS") {
      cost = 5.6099 * finalWeight + 31.202;
    } else if (destination === "BAHRAIN" || destination === "EGYPT" || destination === "LEBANON" ||
               destination === "KUWAIT" || destination === "SAUDI AR" || destination === "WEST BANK") {
      cost = 3.2901 * finalWeight + 36.588;
    } else if (destination === "TUNIS" || destination === "S-KOREA") {
      cost = 4.2665 * finalWeight + 49.031;
    } else if (destination === "CYPRUS" || destination === "IRAQ") {
      cost = 4.5393 * finalWeight + 50.794;
    } else if (destination === "JERSEY CI" || destination === "IRELAND" || destination === "SENEGAL" || destination === "MONACO") {
      cost = 5.0436 * finalWeight + 48.908;
    } else if (destination === "AUSTRIA" || destination === "DENMARK" || destination === "FINLAND" || 
               destination === "GREECE" || destination === "LUXEMBOURG" || destination === "PAKISTAN" || 
               destination === "SINGAPORE" || destination === "SWEDEN") {
      cost = 6.2087 * finalWeight + 64.293;
    } else if (destination === "ICELAND" || destination === "INDONESIA" || destination === "SOUTH KOREA" || 
               destination === "MALAYSIA" || destination === "NEW ZEALAND" || destination === "PHILLIPINES" || 
               destination === "SRI LANKA" || destination === "THAILAND") {
      cost = 5.0436 * finalWeight + 48.908;
    } else if (destination === "BRUNEI" || destination === "CHILE" || destination === "CZECH" || 
               destination === "HUNGARY" || destination === "JAPAN" || destination === "MOROCCO" || 
               destination === "RUSSIA" || destination === "SOUTH AFRICA") {
      cost = 6.2087 * finalWeight + 64.293;
    }
  } else if (type === "Cargo") {
    if (destination === "OMAN" || destination === "UAE" || destination === "QATAR") {
      cost = 2.8728 * finalWeight + 13.205;
    } else if (destination === "BELGIUM" || destination === "FRANCE" || destination === "GERMANY" ||
               destination === "ITALY" || destination === "NETHERLANDS" || destination === "SPAIN" ||
               destination === "UNITED KINGDOM") {
      cost = 4.1883 * finalWeight + 26.266;
    } else if (destination === "CANADA" || destination === "CHINA" || destination === "HONGKONG" || destination === "USA") {
      cost = 4.5756 * finalWeight + 18.714;
    } else if (destination === "ALGIERS" || destination === "INDIA" || destination === "PORTUGAL" || destination === "TURKEY") {
      cost = 4.6749 * finalWeight + 26.002;
    } else if (destination === "BRAZIL") {
      cost = 5.8967 * finalWeight + 27.153;
    } else if (destination === "TAIWAN" || destination === "SWISS") {
      cost = 5.6099 * finalWeight + 31.202;
    } else if (destination === "BAHRAIN" || destination === "EGYPT" || destination === "LEBANON" ||
               destination === "KUWAIT" || destination === "SAUDI AR" || destination === "WEST BANK") {
      cost = 3.2901 * finalWeight + 36.588;
    } else if (destination === "TUNIS" || destination === "S-KOREA") {
      cost = 4.2665 * finalWeight + 49.031;
    } else if (destination === "CYPRUS" || destination === "IRAQ") {
      cost = 4.5393 * finalWeight + 50.794;
    } else if (destination === "JERSEY CI" || destination === "IRELAND" || destination === "SENEGAL" || destination === "MONACO") {
      cost = 5.0436 * finalWeight + 48.908;
    } else if (destination === "AUSTRIA" || destination === "DENMARK" || destination === "FINLAND" || 
               destination === "GREECE" || destination === "LUXEMBOURG" || destination === "PAKISTAN" || 
               destination === "SINGAPORE" || destination === "SWEDEN") {
      cost = 6.2087 * finalWeight + 64.293;
    } else if (destination === "ICELAND" || destination === "INDONESIA" || destination === "SOUTH KOREA" || 
               destination === "MALAYSIA" || destination === "NEW ZEALAND" || destination === "PHILLIPINES" || 
               destination === "SRI LANKA" || destination === "THAILAND") {
      cost = 5.0436 * finalWeight + 48.908;
    } else if (destination === "BRUNEI" || destination === "CHILE" || destination === "CZECH" || 
               destination === "HUNGARY" || destination === "JAPAN" || destination === "MOROCCO" || 
               destination === "RUSSIA" || destination === "SOUTH AFRICA") {
      cost = 6.2087 * finalWeight + 64.293;
    }
  } else if(type==="Sea"){
    if(destination==="BARCELONA")
    {
      if(cpmValue==20)
      cost=2100;
      else cost=4200;
    }
    if(destination==="SHANGHAI")
    {
      if(cpmValue==20)
      cost=1900;
      else cost=3800;
    }
     if(destination==="GENOA")
    {
      if(cpmValue==20)
      cost=2000;
      else cost=4000;
    }
      if(destination==="NEW YORK")
    {
      if(cpmValue==20)
      cost=2300;
      else cost=4600;
    }
  }else if(type==="Land"){
    if(destination==="RUH-KSA")
    {
      if(cpmValue==20)
      cost=1900;
      else cost=3800;
    }
    if(destination==="DXB")
    {
      if(cpmValue==20)
      cost=2400;
      else cost=4800;
    }
     if(destination==="KWI")
    {
      if(cpmValue==20)
      cost=2000;
      else cost=4000;
    }
  }
  // Display result with notification
    if(selectedType === "Sea" || selectedType === "Land")
    {
        document.getElementById("result").textContent = " The shipping cost is: $" + cost.toFixed(2);
    }
  else if (resultMessage) {
    document.getElementById("result").textContent = resultMessage + " The shipping cost is: $" + cost.toFixed(2);
  } else {
    document.getElementById("result").textContent = "The shipping cost is: $" + cost.toFixed(2);
  }
});
