<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_ms',
        'specialization',
        'specialization_ms',
        'qualification',
        'qualification_ms',
        'experience_years',
        'languages',
        'bio',
        'bio_ms',
        'image',
        'branch_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'languages' => 'array',
        'experience_years' => 'integer',
    ];

    /**
     * Get the branch that the doctor belongs to.
     */
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the bookings for the doctor.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Scope a query to only include active doctors.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter doctors by branch.
     */
    public function scopeForBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }
}
