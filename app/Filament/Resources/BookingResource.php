<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use App\Models\Branch;
use App\Models\Doctor;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationGroup = 'Clinic Management';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Appointment Details')
                    ->schema([
                        Forms\Components\Select::make('branch_id')
                            ->label('Branch')
                            ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required()
                            ->live()
                            ->afterStateUpdated(fn (Forms\Set $set) => $set('doctor_id', null)),
                        Forms\Components\Select::make('doctor_id')
                            ->label('Doctor')
                            ->options(function (Get $get) {
                                $branchId = $get('branch_id');
                                if (!$branchId) {
                                    return [];
                                }
                                return Doctor::where('branch_id', $branchId)
                                    ->where('is_active', true)
                                    ->pluck('name', 'id');
                            })
                            ->searchable()
                            ->preload()
                            ->helperText('Select a branch first to see available doctors'),
                        Forms\Components\Select::make('service_id')
                            ->label('Service')
                            ->options(Service::where('is_active', true)->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\DatePicker::make('appointment_date')
                                    ->label('Date')
                                    ->required()
                                    ->minDate(now())
                                    ->native(false),
                                Forms\Components\TimePicker::make('appointment_time')
                                    ->label('Time')
                                    ->required()
                                    ->seconds(false)
                                    ->native(false),
                            ]),
                    ]),

                Forms\Components\Section::make('Patient Information')
                    ->schema([
                        Forms\Components\TextInput::make('patient_name')
                            ->label('Patient Name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('patient_phone')
                            ->label('Phone Number')
                            ->tel()
                            ->required()
                            ->maxLength(20),
                        Forms\Components\TextInput::make('patient_email')
                            ->label('Email')
                            ->email()
                            ->maxLength(255),
                    ]),

                Forms\Components\Section::make('Status & Notes')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'confirmed' => 'Confirmed',
                                'cancelled' => 'Cancelled',
                                'completed' => 'Completed',
                            ])
                            ->default('pending')
                            ->required(),
                        Forms\Components\Textarea::make('notes')
                            ->label('Notes')
                            ->rows(3)
                            ->placeholder('Additional notes about the appointment'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('patient_name')
                    ->label('Patient')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('patient_phone')
                    ->label('Phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('branch.name')
                    ->label('Branch')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                Tables\Columns\TextColumn::make('doctor.name')
                    ->label('Doctor')
                    ->sortable(),
                Tables\Columns\TextColumn::make('service.name')
                    ->label('Service')
                    ->sortable(),
                Tables\Columns\TextColumn::make('appointment_date')
                    ->label('Date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('appointment_time')
                    ->label('Time')
                    ->time('H:i'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'success',
                        'cancelled' => 'danger',
                        'completed' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('appointment_date', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'cancelled' => 'Cancelled',
                        'completed' => 'Completed',
                    ]),
                Tables\Filters\SelectFilter::make('branch_id')
                    ->label('Branch')
                    ->relationship('branch', 'name'),
                Tables\Filters\SelectFilter::make('doctor_id')
                    ->label('Doctor')
                    ->relationship('doctor', 'name'),
                Tables\Filters\Filter::make('appointment_date')
                    ->form([
                        Forms\Components\DatePicker::make('from')
                            ->label('From Date'),
                        Forms\Components\DatePicker::make('until')
                            ->label('Until Date'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('appointment_date', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('appointment_date', '<=', $data['until']));
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('confirm')
                    ->label('Confirm')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Booking $record) => $record->status === 'pending')
                    ->action(fn (Booking $record) => $record->update(['status' => 'confirmed'])),
                Tables\Actions\Action::make('cancel')
                    ->label('Cancel')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (Booking $record) => in_array($record->status, ['pending', 'confirmed']))
                    ->requiresConfirmation()
                    ->action(fn (Booking $record) => $record->update(['status' => 'cancelled'])),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
