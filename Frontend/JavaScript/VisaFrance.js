const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navButtons = document.getElementById('navButtons');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.textContent = menu.classList.contains('active') ? '✕' : '☰';
});



const targetVisaId = 1; 

fetch('/api/visa-details')
  .then(response => {
    console.log(response); // Log the response object
    return response.json();
  })
  .then(data => {
    console.log(data); // Log the fetched data
    const visaCardsContainer = document.getElementById('visa-cards-container');
    visaCardsContainer.innerHTML = ''; // Clear any previous content

    // Find visa by ID
    const visa = data.find(v => v.id === targetVisaId);

    if (visa) {
      const visaCard = document.createElement('div');
      visaCard.classList.add('visa-card');

      const heroTitle = document.querySelector('.hero h1');
      heroTitle.textContent = `${visa.country_name} Student Visa`; 

     

      // Update the paragraph with the country name
      const heroParagraph = document.querySelector('.hero p');
      heroParagraph.textContent = `Your gateway to quality education in ${visa.country_name}`; 

      visaCard.innerHTML = `
        <div class="card-header">
          <img src="${visa.image_url}" alt="Visa Image">
          <h3>${visa.title}</h3>
        </div>
        <div class="visa-info">
          <ul>
            <li><i class="fas fa-clock"></i> Processing Time: ${visa.processing_time}</li>
            <li><i class="fas fa-language"></i> Language: ${visa.language_requirement}</li>
            <li><i class="fas fa-euro-sign"></i> Proof of Funds: ${visa.proof_of_funds}</li>
            <li><i class="fas fa-calendar-alt"></i> Validity: ${visa.validity}</li>
            <li><i class="fas fa-briefcase"></i> Work Rights: ${visa.work_rights}</li>
            <li><i class="fas fa-graduation-cap"></i> Required for: ${visa.requirement_note}</li>
          </ul>
        </div>
        <div class="country-links">
          <a href="${visa.apply_link}" target="_blank" class="apply-btn">Apply for Visa</a>
          <a href="${visa.info_link}" target="_blank" class="info-btn">Visa Info</a>
        </div>
      `;

      visaCardsContainer.appendChild(visaCard);
    } else {
      visaCardsContainer.innerHTML = '<p>Visa with this ID was not found.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching visa details:', error);
    const visaCardsContainer = document.getElementById('visa-cards-container');
    visaCardsContainer.innerHTML = '<p>There was an error fetching the visa details.</p>';
  });
