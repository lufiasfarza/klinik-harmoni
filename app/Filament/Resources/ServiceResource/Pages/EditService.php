<?php

namespace App\Filament\Resources\ServiceResource\Pages;

use App\Filament\Resources\ServiceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditService extends EditRecord
{
    protected static string $resource = ServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Load current branch relationships
        $data['branches'] = $this->record->branches()->pluck('branches.id')->toArray();
        return $data;
    }

    protected function handleRecordUpdate($record, array $data): \Illuminate\Database\Eloquent\Model
    {
        // Update the service record
        $record->update($data);
        
        // Sync branches if provided
        if (isset($data['branches'])) {
            $record->syncBranches($data['branches']);
        }
        
        return $record;
    }
}

