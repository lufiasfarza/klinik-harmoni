<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_ms',
        'address',
        'address_ms',
        'city',
        'state',
        'phone',
        'email',
        'operating_hours',
        'latitude',
        'longitude',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the doctors for the branch.
     */
    public function doctors()
    {
        return $this->hasMany(Doctor::class);
    }

    /**
     * Get the bookings for the branch.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * The services that belong to the branch.
     */
    public function services()
    {
        return $this->belongsToMany(Service::class, 'branch_services')
            ->withPivot(['is_available', 'price_override', 'notes'])
            ->withTimestamps();
    }

    /**
     * Scope a query to only include active branches.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
