<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_ms',
        'description',
        'description_ms',
        'price',
        'duration_minutes',
        'category',
        'is_active',
        'price_range_display'
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Many-to-many relationship with branches
    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'branch_services')
                    ->withPivot(['is_available', 'price_override', 'notes'])
                    ->withTimestamps();
    }

    // Handle branch synchronization for Filament
    public function syncBranches($branchIds)
    {
        if (empty($branchIds)) {
            $this->branches()->detach();
            return;
        }

        // Sync branches with default pricing
        $syncData = [];
        foreach ($branchIds as $branchId) {
            $syncData[$branchId] = [
                'is_available' => true,
                'price_override' => $this->price, // Use service base price
                'notes' => 'Default pricing',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $this->branches()->sync($syncData);
        
        // Update price range display
        $this->updatePriceRangeDisplay();
    }

    // Update price range display based on branch pricing
    public function updatePriceRangeDisplay()
    {
        $branchServices = $this->branches()->get();
        
        if ($branchServices->count() > 0) {
            $prices = $branchServices->pluck('pivot.price_override')->filter();
            $minPrice = $prices->min();
            $maxPrice = $prices->max();
            
            if ($minPrice && $maxPrice) {
                $this->price_range_display = "RM {$minPrice}-{$maxPrice}";
                $this->save();
            }
        }
    }
}

