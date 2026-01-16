<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DoctorResource\Pages;
use App\Models\Doctor;
use App\Models\Branch;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DoctorResource extends Resource
{
    protected static ?string $model = Doctor::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-circle';

    protected static ?string $navigationGroup = 'Clinic Management';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Personal Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Name (English)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('name_ms')
                            ->label('Name (Malay)')
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->directory('doctors')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1'),
                    ]),

                Forms\Components\Section::make('Professional Details')
                    ->schema([
                        Forms\Components\TextInput::make('specialization')
                            ->label('Specialization (English)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('specialization_ms')
                            ->label('Specialization (Malay)')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('qualification')
                            ->label('Qualification (English)')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('qualification_ms')
                            ->label('Qualification (Malay)')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('experience_years')
                            ->label('Years of Experience')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(50),
                        Forms\Components\TagsInput::make('languages')
                            ->label('Languages Spoken')
                            ->placeholder('Add language')
                            ->suggestions(['English', 'Malay', 'Mandarin', 'Tamil', 'Cantonese']),
                    ]),

                Forms\Components\Section::make('Biography')
                    ->schema([
                        Forms\Components\Textarea::make('bio')
                            ->label('Biography (English)')
                            ->rows(4),
                        Forms\Components\Textarea::make('bio_ms')
                            ->label('Biography (Malay)')
                            ->rows(4),
                    ])
                    ->collapsible(),

                Forms\Components\Section::make('Assignment')
                    ->schema([
                        Forms\Components\Select::make('branch_id')
                            ->label('Assigned Branch')
                            ->relationship('branch', 'name')
                            ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Inactive doctors will not be shown to patients'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('specialization')
                    ->badge()
                    ->color('primary')
                    ->searchable(),
                Tables\Columns\TextColumn::make('branch.name')
                    ->label('Branch')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                Tables\Columns\TextColumn::make('experience_years')
                    ->label('Experience')
                    ->suffix(' years')
                    ->sortable(),
                Tables\Columns\TextColumn::make('bookings_count')
                    ->label('Bookings')
                    ->counts('bookings')
                    ->badge()
                    ->color('success'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status'),
                Tables\Filters\SelectFilter::make('branch_id')
                    ->label('Branch')
                    ->relationship('branch', 'name'),
                Tables\Filters\SelectFilter::make('specialization')
                    ->options(fn () => Doctor::distinct()->pluck('specialization', 'specialization')->toArray()),
            ])
            ->actions([
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
            'index' => Pages\ListDoctors::route('/'),
            'create' => Pages\CreateDoctor::route('/create'),
            'edit' => Pages\EditDoctor::route('/{record}/edit'),
        ];
    }
}
