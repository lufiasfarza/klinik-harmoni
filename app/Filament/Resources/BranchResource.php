<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BranchResource\Pages;
use App\Models\Branch;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BranchResource extends Resource
{
    protected static ?string $model = Branch::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';

    protected static ?string $navigationGroup = 'Clinic Management';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Branch Name (English)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('name_ms')
                            ->label('Branch Name (Malay)')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('address')
                            ->label('Address (English)')
                            ->required()
                            ->rows(3),
                        Forms\Components\Textarea::make('address_ms')
                            ->label('Address (Malay)')
                            ->rows(3),
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('city')
                                    ->required()
                                    ->maxLength(100),
                                Forms\Components\TextInput::make('state')
                                    ->required()
                                    ->maxLength(100),
                            ]),
                    ]),

                Forms\Components\Section::make('Contact Details')
                    ->schema([
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->required()
                            ->maxLength(20),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('operating_hours')
                            ->label('Operating Hours')
                            ->placeholder('Mon-Fri: 9am-6pm, Sat: 9am-1pm')
                            ->rows(3),
                    ]),

                Forms\Components\Section::make('Location')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('latitude')
                                    ->numeric()
                                    ->step(0.00000001),
                                Forms\Components\TextInput::make('longitude')
                                    ->numeric()
                                    ->step(0.00000001),
                            ]),
                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->directory('branches')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('16:9'),
                    ])
                    ->collapsible(),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Inactive branches will not be shown to patients'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('city')
                    ->badge()
                    ->color('info')
                    ->searchable(),
                Tables\Columns\TextColumn::make('state')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('doctors_count')
                    ->label('Doctors')
                    ->counts('doctors')
                    ->badge()
                    ->color('success'),
                Tables\Columns\TextColumn::make('services_count')
                    ->label('Services')
                    ->counts('services')
                    ->badge()
                    ->color('warning'),
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
                Tables\Filters\SelectFilter::make('city')
                    ->options(fn () => Branch::distinct()->pluck('city', 'city')->toArray()),
                Tables\Filters\SelectFilter::make('state')
                    ->options(fn () => Branch::distinct()->pluck('state', 'state')->toArray()),
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
            'index' => Pages\ListBranches::route('/'),
            'create' => Pages\CreateBranch::route('/create'),
            'edit' => Pages\EditBranch::route('/{record}/edit'),
        ];
    }
}
