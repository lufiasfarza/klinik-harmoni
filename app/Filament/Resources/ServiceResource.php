<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Filament\Resources\ServiceResource\RelationManagers;
use App\Models\Service;
use App\Models\Branch;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->maxLength(65535),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('RM'),
                Forms\Components\TextInput::make('duration_minutes')
                    ->required()
                    ->numeric()
                    ->suffix('minutes'),
                Forms\Components\TextInput::make('category')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('is_active')
                    ->default(true),
                Forms\Components\CheckboxList::make('branches')
                    ->label('Available Branches')
                    ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                    ->columns(2)
                    ->helperText('Select branches that offer this service'),
                Forms\Components\CheckboxList::make('branches')
                    ->label('Available Branches')
                    ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                    ->columns(2)
                    ->helperText('Select branches that offer this service'),
                
                // Branch Selection Section
                Forms\Components\Section::make('Available Branches')
                    ->description('Select which branches offer this service')
                    ->schema([
                        Forms\Components\CheckboxList::make('branches')
                            ->label('Branches Offering This Service')
                            ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                            ->columns(2)
                            ->required()
                            ->helperText('Select all branches that offer this service. This will determine pricing ranges.'),
                    ])
                    ->collapsible(),
                
                // Branch Selection Section
                Forms\Components\Section::make('Available Branches')
                    ->description('Select which branches offer this service')
                    ->schema([
                        Forms\Components\CheckboxList::make('branches')
                            ->label('Branches Offering This Service')
                            ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                            ->columns(2)
                            ->required()
                            ->helperText('Select all branches that offer this service. This will determine pricing ranges.')
                            ->afterStateUpdated(function ($state, callable $set) {
                                // Auto-calculate price range based on selected branches
                                if (!empty($state)) {
                                    $branchServices = \App\Models\BranchService::whereIn('branch_id', $state)
                                        ->where('service_id', request()->route('record'))
                                        ->get();
                                    
                                    if ($branchServices->count() > 0) {
                                        $minPrice = $branchServices->min('price');
                                        $maxPrice = $branchServices->max('price');
                                        $set('price_range_display', "RM {$minPrice}-{$maxPrice}");
                                    }
                                }
                            }),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->limit(50)
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('MYR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price_range_display')
                    ->label('Price Range')
                    ->badge()
                    ->color('success'),
                Tables\Columns\TextColumn::make('duration_minutes')
                    ->suffix(' min')
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->searchable(),
                Tables\Columns\TextColumn::make('branches_count')
                    ->label('Available Branches')
                    ->counts('branches')
                    ->badge()
                    ->color('info'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status'),
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'consultation' => 'Consultation',
                        'therapy' => 'Therapy',
                        'emergency' => 'Emergency',
                        'screening' => 'Screening',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}