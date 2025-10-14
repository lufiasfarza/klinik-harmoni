<?php

namespace App\Filament\Resources\ServiceResource\Pages;

use App\Filament\Resources\ServiceResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateService extends CreateRecord
{
    protected static string $resource = ServiceResource::class;

    protected function handleRecordCreation(array $data): \Illuminate\Database\Eloquent\Model
    {
        // Create the service record
        $record = static::getModel()::create($data);
        
        // Sync branches if provided
        if (isset($data['branches'])) {
            $record->syncBranches($data['branches']);
        }
        
        return $record;
    }
}

