# Laravel Integration Guide untuk Elite Wellness Frontend

## 1. API Endpoints yang Diperlukan

### Booking API
```php
// routes/api.php
Route::prefix('api')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/branches', [BranchController::class, 'index']);
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);
});
```

### Booking Controller
```php
// app/Http/Controllers/BookingController.php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request)
    {
        $booking = Booking::create([
            'branch_id' => $request->branch,
            'doctor_id' => $request->doctor,
            'service_id' => $request->service,
            'appointment_date' => $request->date,
            'appointment_time' => $request->time,
            'patient_name' => $request->name,
            'patient_phone' => $request->phone,
            'patient_email' => $request->email,
            'status' => 'pending',
        ]);

        // Send confirmation email
        // Send WhatsApp notification
        
        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking_id' => $booking->id
        ]);
    }
}
```

### Request Validation
```php
// app/Http/Requests/StoreBookingRequest.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function rules()
    {
        return [
            'branch' => 'required|string|exists:branches,id',
            'doctor' => 'required|string|exists:doctors,id',
            'service' => 'required|string|exists:services,id',
            'date' => 'required|date|after:today',
            'time' => 'required|string',
            'name' => 'required|string|max:50',
            'phone' => 'required|string|regex:/^[\+]?[0-9\s\-\(\)]{10,15}$/',
            'email' => 'required|email|max:255',
        ];
    }
}
```

## 2. Database Migrations

```php
// database/migrations/create_bookings_table.php
Schema::create('bookings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('branch_id')->constrained();
    $table->foreignId('doctor_id')->constrained();
    $table->foreignId('service_id')->constrained();
    $table->date('appointment_date');
    $table->time('appointment_time');
    $table->string('patient_name');
    $table->string('patient_phone');
    $table->string('patient_email');
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed']);
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

## 3. CORS Configuration

```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'https://yourdomain.com'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

## 4. Frontend API Service

```typescript
// src/services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface BookingData {
  branch: string;
  doctor: string;
  service: string;
  date: Date;
  time: string;
  name: string;
  phone: string;
  email: string;
}

export const bookingService = {
  async createBooking(data: BookingData) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        date: data.date.toISOString().split('T')[0],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    return response.json();
  },

  async getBranches() {
    const response = await fetch(`${API_BASE_URL}/branches`);
    return response.json();
  },

  async getDoctors() {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    return response.json();
  },

  async getServices() {
    const response = await fetch(`${API_BASE_URL}/services`);
    return response.json();
  },
};
```

## 5. Environment Variables

```bash
# .env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WHATSAPP_API_URL=https://api.whatsapp.com/send
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 6. Security Considerations

1. **CSRF Protection**: Add CSRF token to forms
2. **Rate Limiting**: Implement rate limiting for booking endpoints
3. **Input Sanitization**: Use Laravel's built-in sanitization
4. **API Authentication**: Consider implementing API tokens
5. **Data Validation**: Server-side validation is crucial

## 7. Performance Optimizations

1. **Caching**: Cache branches, doctors, and services data
2. **Database Indexing**: Add indexes on frequently queried fields
3. **Image Optimization**: Serve optimized images from Laravel
4. **CDN**: Use CDN for static assets

## 8. Monitoring & Logging

```php
// Add to BookingController
Log::info('New booking created', [
    'booking_id' => $booking->id,
    'patient_email' => $request->email,
    'appointment_date' => $request->date,
]);
```
