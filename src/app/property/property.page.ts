import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoBackComponent } from '../components/go-back/go-back.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common'; 
import Swiper from 'swiper';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Storage } from '@ionic/storage-angular';
import { jsPDF } from "jspdf";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
  standalone: true,
  imports: [IonicModule, GoBackComponent, FooterComponent, CommonModule],
})
export class PropertyPage implements OnInit, AfterViewInit {
  showFirstRow: boolean = true; // Toggle this to show/hide the first row
  showSecondRow: boolean = true; // Toggle this to show/hide the second row
  plotType: string = '';
  propertyDetails: { key: string, value: string }[] = [];
  userId: string | null = null;
  userEmail: string | null = null;
  favoriteProperties: Set<number> = new Set();
  propertyId: number | null = null; // Store property ID
  properties: any = {}; // Initialize as an object, not an array
  swiper: Swiper | undefined;
  baseUrl = 'https://vibrantlivingblog.com/ksjabalpur/';

  constructor(
    private toastController: ToastController,
    private storage: Storage,
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const navigationState = history.state;
  
    if (navigationState && navigationState.propertyId) {
      this.propertyId = navigationState.propertyId;
      console.log('Received property ID:', this.propertyId);
  
      // Call fetchPropertyDetails only if propertyId is not null
      if (this.propertyId !== null) {
        await this.fetchPropertyDetails(this.propertyId);
      }
    } else {
      console.error('No property ID found in navigation state');
    }
  
    try {
      await this.storage.create(); // Ensure storage is initialized properly
      this.userId = await this.storage.get('user_id');
      this.userEmail = await this.storage.get('email');
  
      if (this.userId) {
        console.log('User ID found:', this.userId,this.userEmail);
        this.checkFavoriteProperties(this.userId);
      } else {
        console.warn('User ID not found in storage.');
      }
    } catch (error) {
      console.error('Error initializing storage or fetching user ID:', error);
    }
  }

  ngAfterViewInit(): void {
    // Initialize Swiper after the view is initialized or after properties are updated
    this.cdr.detectChanges(); // Ensure the view is fully initialized before swiper setup
    this.initializeSwiper();
  }

  goBack(): void {
    this.location.back();
  }

  fetchPropertyDetails(propertyId: number): void {
    let plotType = '';
    let freeHold = '';
    let plotDirection = '';
    let cornerPlot = '';
    const apiUrl = ROUTES.PROPERTY_DETAILS;
    const headers = new HttpHeaders({
      'Authorization': '2245',
      'Content-Type': 'application/json',
    });
  
    const body = { property_id: propertyId };
  
    this.http.post<any>(apiUrl, body, { headers }).subscribe(
      response => {
        console.log('API Response:', response);
        const propertyData = response.data; // This is the property data object
        console.log('Property Data:', propertyData);
  
        // Update image paths with base URL
        if (propertyData.main_img_path) {
          propertyData.main_img_path = this.baseUrl + propertyData.main_img_path;
        }
        if (propertyData.image_paths) {
          propertyData.image_paths = propertyData.image_paths.map((path: string) => this.baseUrl + path);
        }
  
        // Assign the fetched data to properties object
        this.properties = propertyData;
        console.log('Updated property details:', this.properties);
        
        console.log("catrgory is",this.properties.Category)
        if (this.properties.Category === "Residential") {
          this.showFirstRow = true;
          this.showSecondRow = true; // Optional: Hide second row if needed
        } else {
          this.showFirstRow = true;
          this.showSecondRow = false; // Show second row for other cases
        }
        // Initialize plotType based on select_plot_no
        switch (this.properties.select_plot_no) {
          case '1':
            plotType = 'Plot No';
            break;
          case '2':
            plotType = 'Unit No';
            break;
          case '3':
            plotType = 'House No';
            break;
          default:
            plotType = 'Unknown';
            break;
        }
        switch (this.properties.front_direction) {
          case '1':
            plotDirection = 'North';
            break;
          case '2':
            plotDirection = 'South';
            break;
          case '3':
            plotDirection = 'East';
            break;
          default:
            plotDirection = 'West';
            break;
        }
        if(this.properties.free_hold=="1"){
          freeHold="yes";
        }
        else{
          freeHold="no"; 
        }
        if(this.properties.corner_plot=="1"){
          cornerPlot="yes";
        }
        else{
          cornerPlot="no"; 
        }
  
        // Update the propertyDetails array with dynamic plotType
        this.propertyDetails = [
          { key: plotType, value: this.properties.plot_no },  // Using plotType here
          { key: 'Free Hold', value: freeHold },
          { key: 'Front Direction', value: plotDirection },
          { key: 'Corner Plot', value: cornerPlot },
          { key: 'Price per sqft', value: this.properties.price_per_sqft},
          { key: 'Area', value: `${this.properties.property_area} sqft` },
          { key: 'Finance Approval', value: this.properties.finance_aproval}
        ];
  
        // After properties are updated, refresh the swiper
        this.cdr.detectChanges(); // Detect changes after fetching data
        this.initializeSwiper(); // Reinitialize or refresh Swiper
      },
      error => {
        console.error('Error fetching property details:', error);
      }
    );
  }  

  initializeSwiper(): void {
    if (!this.swiper) {
      // Ensure that the swiper container is available
      const swiperContainer = document.querySelector('.image-slider');
      
      // If the swiper container exists, initialize Swiper
      if (swiperContainer) {
        this.swiper = new Swiper('.image-slider', {
          slidesPerView: 1,
          spaceBetween: 10,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      } else {
        console.error('Swiper container not found');
      }
    } else {
      // If swiper is already initialized, update it
      this.swiper.update();
    }
  }

  // Fetch favorite properties for the user
  checkFavoriteProperties(userId: string): void {
    const url = ROUTES.CHECK_FAVOURITE; // Replace with your actual endpoint
    const body = { user_id: userId }; // Send user_id in the body
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http.post<any>(url, body, { headers }).subscribe(
      (response) => {
        console.log("Favorite is", response.message);
  
        const favoriteData = response.message; // Extract the message
        this.favoriteProperties.clear();
  
        // Check if favoriteData is an array or object and handle accordingly
        if (Array.isArray(favoriteData)) {
          favoriteData.forEach((item: any) => {
            if (item.id) {
              this.favoriteProperties.add(item.id);
            }
          });
        } else if (favoriteData && favoriteData.id) {
          this.favoriteProperties.add(favoriteData.id);
        } else {
          console.warn("No valid favorite properties found.");
        }
  
        console.log('Loaded favorite properties:', this.favoriteProperties);
      },
      (error) => {
        console.error('Error fetching favorite properties:', error);
      }
    );
  }
  

  // Toggle favorite property
  async toggleIcon(event: Event, property: any): Promise<void> {
    event.stopPropagation();
    this.userId = await this.storage.get('user_id');
    if (!this.userId) {
      console.error('User ID not found in storage.');
      return;
    }
    console.log('Property object:', property);
    const propertyId = property.property_id; // Ensure you're using the correct property ID here
    console.log('Toggling property with ID:', propertyId);
    if (!propertyId) {
      console.error('Property ID is null or undefined.');
      return;
    }
  
    // Toggle the property in the favorites set
    if (this.favoriteProperties.has(propertyId)) {
      this.favoriteProperties.delete(propertyId);
      console.log(`Removed from favorites: ${propertyId}`);
      this.removeFromFavorites(this.userId, propertyId);
    } else {
      this.favoriteProperties.add(propertyId);
      console.log(`Added to favorites: ${propertyId}`);
      this.addToFavorites(this.userId, propertyId);
    }
  }

  // Add to favorites API call
  addToFavorites(userId: string, propertyId: number): void {
    const url = ROUTES.ADD_FAVOURITE; // Replace with your actual endpoint
    const iconAction="add";
    const body = { user_id: userId, property_id: propertyId,action:iconAction};
    console.log(body);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(url, body, { headers }).subscribe(
      (response) => {
        console.log('Added to favorites successfully:', response);
      },
      (error) => {
        console.error('Error adding to favorites:', error);
      }
    );
  }

  // Remove from favorites API call
  removeFromFavorites(userId: string, propertyId: number): void {
    const url = `${ROUTES.ADD_FAVOURITE}`; // Replace with your actual endpoint
    const iconAction="remove";
    const body = { user_id: userId, property_id: propertyId,action:iconAction};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(url, body, { headers }).subscribe(
      (response) => {
        console.log('Removed from favorites successfully:', response);
      },
      (error) => {
        console.error('Error removing from favorites:', error);
      }
    );
  }

  // Check if the icon should be filled
  isIconFilled(property: any): boolean {
    // Check if property is defined and has an 'id' field
    if (property && property.property_id) {
      const propertyId = property.property_id; // Access the 'property_id' field
      return this.favoriteProperties.has(propertyId); // Check if property is in favorites
    }
    return false; // Return false if property or 'property_id' is not defined
  }
  
  downloadPdf() {
    
    console.log("click from phone");
    const property = this.properties;
    console.log("pdf",property)
    console.log(property.image_paths)
    console.log(property.image_paths.length);
  
    // Define the type for the details array
    interface Detail {
      key: string;
      value: string;
    }
  
    const details: Detail[] = [
      { key: 'Plot No', value: '797/816' },
      { key: 'Type', value: 'Commercial' },
      { key: 'Free Hold', value: 'No' },
      { key: 'Front Direction', value: 'North' },
      { key: 'Boundary Wall', value: 'No' },
      { key: 'Corner Plot', value: 'Yes' },
      { key: 'Price per sqft', value: '15000/-' },
      { key: 'Area', value: '1500sqft' },
      { key: 'Negotiable', value: 'Yes' }
    ];
  
    // Initialize jsPDF instance
    const doc = new jsPDF();
    const footerlogo = '../assets/logo.png'; // Replace with your logo image path
    const logoPath = '../assets/ks.png'; // Replace with your logo image path
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    // Add logo at the center
    doc.addImage(logoPath, 'PNG', pageWidth / 2 - 7.5, pageHeight / 2 - 7.5, 15, 15); // Reduced logo size to 15x15

  
    // Add Heading at the center below the logo
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    // Set color for the first text (Welcome to)
    // Set color for the first text (Welcome to)
    doc.setTextColor(248, 216, 20); // Yellow color (#F8D814)
    doc.text("Welcome to", pageWidth / 2, pageHeight / 2 + 30, { align: "center" });

    // Set color for the second text (Jabalpur Realty Venture)
    doc.setTextColor(251, 3, 3); // Red color (#FB0303)
    doc.text("Jabalpur Realty Venture", pageWidth / 2, pageHeight / 2 + 50, { align: "center" });

  
    // Add a new page for property details
    doc.addPage();
    
    // Property Details (from the second page onwards)
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    const propertyName = `Name: ${property.property_name || 'No Name available'}`;
    doc.text(propertyName, 20, 30);
  
    const locationInfo = `Address: ${property.property_address || 'No address available'}`;
    doc.text(locationInfo, 20, 50);
  
    // Property Images (Swiper-like image slider)
    if (property.image_paths && property.image_paths.length > 0) {
      let imageYOffset = 70;
    
      // Check if the first image is available and valid
      if (property.image_paths[0] && typeof property.image_paths[0] === 'string' && property.image_paths[0].startsWith('data:image')) {
        doc.addImage(property.image_paths[0], "JPEG", 20, imageYOffset, 80, 60);
      } else {
        // Add alternate text when the first image is not available
        doc.setFontSize(12);
        doc.text('Image not available', 20, imageYOffset);
      }
    
      // Check if the second image is available and valid
      if (property.image_paths[1] && typeof property.image_paths[1] === 'string' && property.image_paths[1].startsWith('data:image')) {
        doc.addImage(property.image_paths[1], "JPEG", 110, imageYOffset, 80, 60);
      } else {
        // Add alternate text when the second image is not available
        doc.setFontSize(12);
        doc.text('Image not available', 110, imageYOffset);
      }
    }
  
    // Add other property features and more details
    const features = [
      { icon: 'assets/bed.png', label: 'Bed Room' },
      { icon: 'assets/bedRoom.png', label: 'Bedroom' },
      { icon: 'assets/wall.png', label: 'Wall' },
      { icon: 'assets/parking.png', label: 'Parking' }
    ];
  
    let featureYOffset = 180;
    features.forEach((item, index) => {
      const iconPath = item.icon;
      const label = item.label;
      
      // Add the icon with a smaller size (10x10)
      doc.addImage(iconPath, 'PNG', 20 + (index % 2) * 90, featureYOffset + Math.floor(index / 2) * 30, 10, 10);
      
      // Add label with adjusted position (more space between icon and text)
      doc.text(label, 35 + (index % 2) * 90, featureYOffset + Math.floor(index / 2) * 30 + 5);
    });
  
    // More Details Section
    doc.setFontSize(14);
    doc.text("More Details", 20, featureYOffset + 60);
  
    // Loop to print key-value details
    let yOffset = featureYOffset + 70;
    details.forEach((detail: Detail, index: number) => {
      // Check if we need to add a new page due to overflow
      if (yOffset > pageHeight - 20) {
        doc.addPage(); // Add a new page
        yOffset = 20; // Reset Y offset to the top of the new page
      }
  
      doc.text(`${detail.key}:`, 20, yOffset);
      doc.text(detail.value, 120, yOffset, { maxWidth: 70 });
      yOffset += 10;
    });
  
    // Add Description Section
    doc.setFontSize(12);
    doc.text("Description", 20, yOffset + 10);
    doc.text("Beautiful 3,4,5,6 BHK apartments in Zirakpur, are now available in Green Lotus Utsav housing project. Prices of apartments in this project vary between Rs. 1.85 - 12.84 Cr. Green Lotus Utsav has apartments in multiple configurations, ranging from 2,100 - 9,945 sq.ft. Green Lotus Utsav is a RERA-registered society and PBRERA-SAS79-PR0425 is the RERA registration number.", 20, yOffset + 20, { maxWidth: 170 });
  
    // Total Amount Section
    doc.setFontSize(12);
    doc.text("Total Amount:", 20, yOffset + 80);
    doc.text(`${property.current_price || 'N/A'}`, 90, yOffset + 80);
  
    // Add logo to the last page (bottom-right corner)
    const lastPage = doc.internal.pages.length; // Get the total number of pages
    doc.setPage(lastPage); // Go to the last page
    doc.addImage(footerlogo, 'PNG', pageWidth - 40, pageHeight - 40, 15, 15); // Logo at the bottom-right corner, size reduced to half
  
    // Save the PDF with a filename
    doc.save(`${property.property_name}_Details.pdf`);
  }
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Show for 3 seconds
      color: color, // 'success' for green, 'danger' for red
      position: 'bottom',
    });
    toast.present();
  }
  
  sendEnquiry(properties: any) {    
    this.presentToast("Sending Email to Builder!", "success");
    const property = Array.isArray(properties) ? properties[0] : properties;
    const builderMail = property.builder_email;
    const propertyID = property.property_id;
  
    console.log("Builder Test", builderMail);
  
    const message = {
      message: {
        id: property.property_id,
        property_name: property.property_name,
        location: property.property_address,
        Builder_Email: property.builder_email,
        Price: property.current_price
      }
    };
  
    const url = ROUTES.SEND_ENQUIY; // Replace with your actual endpoint
    const body = {
      user_email: this.userEmail,
      message: message,
      builder_email: builderMail,
      subject: "Property Enquiry",
      property_id: propertyID
    };
    console.log("body is:",body)
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http.post<any>(url, body, { headers }).subscribe(
      (response) => {
        console.log("Enquiry mail response:", response);
    
        // Check if response has 'status' and if it's true
        if (response.status === 200) {
          this.presentToast("Enquiry sent successfully!", "success");
        } else {
          // If the 'status' is not true or not provided
          this.presentToast("Failed to send enquiry. Please try again.", "danger");
        }
      },
      (error) => {
        console.error('Error sending enquiry:', error);
    
        // Handling different types of errors
        if (error.status === 200) {
          // Network or connection issue
          this.presentToast("Enquiry sent successfully!", "success");
        } else {
          // General error message
          this.presentToast("Error occurred. Please try again later.", "danger");
        }
      }
    );    
  } 
}
